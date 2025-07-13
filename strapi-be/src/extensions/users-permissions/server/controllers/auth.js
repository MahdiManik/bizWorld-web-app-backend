"use strict";

/**
 * Auth.js controller
 *
 * @description: A set of functions called "actions" for managing `Auth`.
 */

/* eslint-disable no-useless-escape */
const crypto = require("crypto");
const _ = require("lodash");
const { concat, compact, isArray } = require("lodash/fp");
const utils = require("@strapi/utils");
const { getService, createOtpToken } = require("../utils");
const {
  validateCallbackBody,
  validateRegisterBody,
  validateSendEmailConfirmationBody,
  validateForgotPasswordBody,
  validateResetPasswordBody,
  validateEmailConfirmationBody,
  validateChangePasswordBody,
} = require("./validation/auth");

const { ApplicationError, ValidationError, ForbiddenError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

const sendConfirmationEmail = async (user) => {
  const { otpCode } = await createOtpToken({ payload: { userId: user.id } });
  const emailToSend = {
    to: user.email,
    from: process.env.EMAIL_FROM,
    replyTo: process.env.EMAIL_REPLY_TO,
    subject: "Email Confirmation",
    text: `Your OTP code is ${otpCode}`,
    html: `<h1>Your OTP code is ${otpCode}</h1>`,
  };

  await strapi.plugin("email").service("email").send(emailToSend);
};

const sendInformationEmail = async (user, password) => {
  const { email } = user;

  const subject = "Account created";

  const content = `<p>Dear ${user.username},</p>
    <p>Your account has been created successfully.</p>
    <p>Your username: ${user.username}</p>
    <p>Your password: ${password}</p>
    <p>Thank you for using our service.</p>`;

  await strapi.plugins["email"].services.email.send({
    to: email,
    from: process.env.EMAIL_FROM,
    subject,
    text: content,
    html: content,
  });
};

module.exports = ({ strapi }) => ({
  async callback(ctx) {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;

    const store = strapi.store({ type: "plugin", name: "users-permissions" });
    const grantSettings = await store.get({ key: "grant" });

    const grantProvider = provider === "local" ? "email" : provider;

    if (!_.get(grantSettings, [grantProvider, "enabled"])) {
      throw new ApplicationError("This provider is disabled");
    }

    if (provider === "local") {
      await validateCallbackBody(params);

      const { identifier } = params;

      // Check if the user exists.
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            provider,
            $or: [
              { email: identifier.toLowerCase() },
              { username: identifier },
            ],
          },
          populate: ["role"], // Make sure to populate the role
        });

      if (!user) {
        throw new ValidationError("Invalid identifier or password");
      }

      if (!user.password) {
        throw new ValidationError("Invalid identifier or password");
      }

      const validPassword = await getService("user").validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        throw new ValidationError("Invalid identifier or password");
      }

      const advancedSettings = await store.get({ key: "advanced" });
      const requiresConfirmation = _.get(
        advancedSettings,
        "email_confirmation"
      );

      if (requiresConfirmation && user.confirmed !== true) {
        throw new ApplicationError("Your account email is not confirmed");
      }

      if (user.blocked === true) {
        throw new ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }

      try {
        // Check if user is not admin and their status is not ACCEPTED
        console.log("User object:", JSON.stringify(user, null, 2));

        if (!user.role) {
          console.error("User role is missing");
          // Try to fetch the role directly if it wasn't populated
          const userWithRole = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
              where: { id: user.id },
              populate: ["role"],
            });

          if (!userWithRole || !userWithRole.role) {
            throw new ApplicationError(
              "Your account has an invalid role configuration. Please contact support."
            );
          }

          // Update the user object with the role
          user.role = userWithRole.role;
        }

        if (!user.role.id) {
          console.error("User role ID is missing");
          throw new ApplicationError(
            "Your account has an invalid role configuration. Please contact support."
          );
        }

        const userRole = await strapi.db
          .query("plugin::users-permissions.role")
          .findOne({
            where: { id: user.role.id },
          });

        console.log("User role:", JSON.stringify(userRole, null, 2));

        if (!userRole) {
          console.error("Role not found for user:", user.id);
          throw new ApplicationError(
            "User role configuration error. Please contact support."
          );
        }

        // Only check userStatus for non-admin users
        if (userRole.type !== "admin") {
          console.log(
            "Checking user status for non-admin user. Status:",
            user.userStatus
          );

          if (user.userStatus === "PENDING") {
            throw new ApplicationError("Account not approved");
          }

          if (user.userStatus === "REJECTED") {
            throw new ApplicationError(
              "Your account has been rejected. Please contact the administrator."
            );
          }

          // Normalize the status for comparison (case-insensitive)
          const normalizedStatus = user.userStatus?.toUpperCase().trim();

          // Allow login if status is "ACCEPTED" (with either spelling)
          if (normalizedStatus !== "ACCEPTED") {
            throw new ApplicationError(
              `Your account status (${user.userStatus}) does not allow login. Please contact the administrator.`
            );
          }
        }
      } catch (error) {
        console.error("Error during role/status check:", error);
        throw error; // Re-throw the error to maintain the same error handling flow
      }

      return ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    }

    // Connect the user with the third-party provider.
    try {
      const user = await getService("providers").connect(provider, ctx.query);

      if (user.blocked) {
        throw new ForbiddenError(
          "Your account has been blocked by an administrator"
        );
      }

      return ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  },

  async changePassword(ctx) {
    if (!ctx.state.user) {
      throw new ApplicationError(
        "You must be authenticated to reset your password"
      );
    }

    const validations = strapi.config.get(
      "plugin::users-permissions.validationRules"
    );

    const { currentPassword, password } = await validateChangePasswordBody(
      ctx.request.body,
      validations
    );

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { id: ctx.state.user.id } });

    const validPassword = await getService("user").validatePassword(
      currentPassword,
      user.password
    );

    if (!validPassword) {
      throw new ValidationError("The provided current password is invalid");
    }

    if (currentPassword === password) {
      throw new ValidationError(
        "Your new password must be different than your current password"
      );
    }

    await getService("user").edit(user.id, { password });

    ctx.send({
      jwt: getService("jwt").issue({ id: user.id }),
      user: await sanitizeUser(user, ctx),
    });
  },

  async resetPassword(ctx) {
    const validations = strapi.config.get(
      "plugin::users-permissions.validationRules"
    );

    const { password, passwordConfirmation, code } =
      await validateResetPasswordBody(ctx.request.body, validations);

    if (password !== passwordConfirmation) {
      throw new ValidationError("Passwords do not match");
    }

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { resetPasswordToken: code } });

    if (!user) {
      throw new ValidationError("Incorrect code provided");
    }

    await getService("user").edit(user.id, {
      resetPasswordToken: null,
      password,
    });

    // Update the user.
    ctx.send({
      jwt: getService("jwt").issue({ id: user.id }),
      user: await sanitizeUser(user, ctx),
    });
  },

  async connect(ctx, next) {
    const grant = require("grant").koa();

    const providers = await strapi
      .store({ type: "plugin", name: "users-permissions", key: "grant" })
      .get();

    const apiPrefix = strapi.config.get("api.rest.prefix");
    const grantConfig = {
      defaults: {
        prefix: `${apiPrefix}/connect`,
      },
      ...providers,
    };

    const [requestPath] = ctx.request.url.split("?");
    const provider = requestPath.split("/connect/")[1].split("/")[0];

    if (!_.get(grantConfig[provider], "enabled")) {
      throw new ApplicationError("This provider is disabled");
    }

    if (!strapi.config.server.url.startsWith("http")) {
      strapi.log.warn(
        "You are using a third party provider for login. Make sure to set an absolute url in config/server.js. More info here: https://docs.strapi.io/developer-docs/latest/plugins/users-permissions.html#setting-up-the-server-url"
      );
    }

    // Ability to pass OAuth callback dynamically
    const queryCustomCallback = _.get(ctx, "query.callback");
    const dynamicSessionCallback = _.get(ctx, "session.grant.dynamic.callback");

    const customCallback = queryCustomCallback ?? dynamicSessionCallback;

    // The custom callback is validated to make sure it's not redirecting to an unwanted actor.
    if (customCallback !== undefined) {
      try {
        // We're extracting the callback validator from the plugin config since it can be user-customized
        const { validate: validateCallback } = strapi
          .plugin("users-permissions")
          .config("callback");

        await validateCallback(customCallback, grantConfig[provider]);

        grantConfig[provider].callback = customCallback;
      } catch (e) {
        throw new ValidationError("Invalid callback URL provided", {
          callback: customCallback,
        });
      }
    }

    // Build a valid redirect URI for the current provider
    grantConfig[provider].redirect_uri =
      getService("providers").buildRedirectUri(provider);

    return grant(grantConfig)(ctx, next);
  },

  async forgotPassword(ctx) {
    const { email } = await validateForgotPasswordBody(ctx.request.body);

    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    const emailSettings = await pluginStore.get({ key: "email" });
    const advancedSettings = await pluginStore.get({ key: "advanced" });

    // Find the user by email.
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { email: email.toLowerCase() } });

    if (!user || user.blocked) {
      return ctx.send({ ok: true });
    }

    // Generate random token.
    const userInfo = await sanitizeUser(user, ctx);

    const resetPasswordToken = crypto.randomBytes(64).toString("hex");

    const resetPasswordSettings = _.get(
      emailSettings,
      "reset_password.options",
      {}
    );
    // const emailBody = await getService('users-permissions').template(
    //   resetPasswordSettings.message,
    //   {
    //     URL: advancedSettings.email_reset_password,
    //     SERVER_URL: strapi.config.get('server.absoluteUrl'),
    //     ADMIN_URL: strapi.config.get('admin.absoluteUrl'),
    //     USER: userInfo,
    //     TOKEN: resetPasswordToken,
    //   }
    // );

    const { otpCode, verifyOtpToken } = await createOtpToken({
      payload: { userId: user.id },
    });

    const emailBody = `<h1>Reset Password confirmation code is: ${otpCode}</h1>`;

    const emailObject = await getService("users-permissions").template(
      resetPasswordSettings.object,
      {
        USER: userInfo,
      }
    );

    console.log(user.email);

    console.log(resetPasswordSettings.from.name);
    console.log(resetPasswordSettings.from.email);

    const emailToSend = {
      to: user.email,
      from:
        resetPasswordSettings.from.email || resetPasswordSettings.from.name
          ? `${resetPasswordSettings.from.name} <${resetPasswordSettings.from.email}>`
          : undefined,
      replyTo: resetPasswordSettings.response_email,
      subject: emailObject,
      text: emailBody,
      html: emailBody,
    };

    // NOTE: Update the user before sending the email so an Admin can generate the link if the email fails
    await getService("user").edit(user.id, {
      resetPasswordToken,
      confirmationToken: verifyOtpToken,
      // confirmationTokenExpires: verifyOtpExpires,
    });

    // Send an email to the user.
    await strapi.plugin("email").service("email").send(emailToSend);
    const existed = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          $or: [
            { email: user.email.toLowerCase() },
            { username: user.username },
          ],
        },
      });

    ctx.send({ ok: true });
  },

  async register(ctx) {
    console.log(ctx.state.user);

    const isAdmin = ctx.state?.user?.role?.type === "admin";

    if (isAdmin) {
      const pluginStore = await strapi.store({
        type: "plugin",
        name: "users-permissions",
      });

      const settings = await pluginStore.get({ key: "advanced" });

      // generate random password
      const password = Math.random().toString(36).slice(-8);

      const { email, username, role, ...rest } = ctx.request.body;

      const identifierFilter = {
        $or: [
          { email: email.toLowerCase() },
          { username: email.toLowerCase() },
          { username },
          { email: username },
        ],
      };

      const conflictingUserCount = await strapi.db
        .query("plugin::users-permissions.user")
        .count({
          where: { ...identifierFilter },
        });

      if (conflictingUserCount > 0) {
        throw new ApplicationError("Email or Username are already taken");
      }

      if (settings.unique_email) {
        const conflictingUserCount = await strapi.db
          .query("plugin::users-permissions.user")
          .count({
            where: { ...identifierFilter },
          });

        if (conflictingUserCount > 0) {
          throw new ApplicationError("Email or Username are already taken");
        }
      }

      const newUser = {
        ...rest,
        role,
        email: email.toLowerCase(),
        username,
        confirmed: true,
        password,
      };

      const user = await getService("user").add(newUser);

      const sanitizedUser = await sanitizeUser(user, ctx);

      await sendInformationEmail(user, password);
      const jwt = getService("jwt").issue(_.pick(user, ["id"]));

      return ctx.send({
        jwt,
        user: sanitizedUser,
      });
    } else {
      try {
        console.log('Starting registration flow...');
        console.log('Request body:', JSON.stringify(ctx.request.body, null, 2));
        
        const pluginStore = await strapi.store({
          type: "plugin",
          name: "users-permissions",
        });
        console.log('Plugin store initialized');
        
        const settings = await pluginStore.get({ key: "advanced" });
        console.log('Plugin settings:', JSON.stringify(settings, null, 2));

        if (!settings.allow_register) {
          console.log('Registration is disabled in settings');
          throw new ApplicationError("Register action is currently disabled");
        }

      /* ------------------------------------------------------------------ */
      /* 1. White‑list the fields a visitor may send                        */
      /* ------------------------------------------------------------------ */
      console.log('Validating request fields...');
      const { register } = strapi.config.get("plugin::users-permissions");
      console.log('Register config:', JSON.stringify(register, null, 2));
      
      const alwaysAllowedKeys = [
        "username",
        "password",
        "email",
        "fullName",
        "phone",
      ];

      const allowedKeys = compact(
        concat(
          alwaysAllowedKeys,
          isArray(register?.allowedFields) ? register.allowedFields : []
        )
      );
      console.log('Allowed keys:', allowedKeys);

      const requestKeys = Object.keys(ctx.request.body);
      console.log('Request keys:', requestKeys);
      
      const invalidKeys = requestKeys.filter(
        (k) => !allowedKeys.includes(k)
      );
      
      if (invalidKeys.length) {
        console.log('Invalid keys found:', invalidKeys);
        throw new ValidationError(
          `Invalid parameters: ${invalidKeys.join(", ")}`
        );
      }

      /* ------------------------------------------------------------------ */
      /* 2. Validate core fields (password strength, e‑mail format, …)      */
      /* ------------------------------------------------------------------ */
      const params = {
        ..._.pick(ctx.request.body, allowedKeys),
        provider: "local",
      };

      const validations = strapi.config.get(
        "plugin::users-permissions.validationRules"
      );
      await validateRegisterBody(params, validations);

      /* ------------------------------------------------------------------ */
      /* 3. Uniqueness checks                                               */
      /* ------------------------------------------------------------------ */
      const { email, username, provider } = params;
      const identifierFilter = {
        $or: [
          { email: email.toLowerCase() },
          { username: email.toLowerCase() },
          { username },
          { email: username },
        ],
      };

      const existing = await strapi.db
        .query("plugin::users-permissions.user")
        .count({ where: { ...identifierFilter, provider } });

      if (existing) {
        throw new ApplicationError("Email or Username are already taken");
      }

      if (settings.unique_email) {
        const emailTaken = await strapi.db
          .query("plugin::users-permissions.user")
          .count({ where: { ...identifierFilter } });
        if (emailTaken) {
          throw new ApplicationError("Email or Username are already taken");
        }
      }

      /* ------------------------------------------------------------------ */
      /* 4. Build a payload for later user creation                         */
      /* ------------------------------------------------------------------ */
      const defaultRole = await strapi.db
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: settings.default_role } });

      if (!defaultRole) {
        throw new ApplicationError("Impossible to find the default role");
      }

      const userData = {
        ...params, // username, password, fullName, phone …
        role: defaultRole.id,
        provider: "local",
      };

      /* ------------------------------------------------------------------ */
      /* 5. Generate OTP + short‑lived registration token                   */
      /* ------------------------------------------------------------------ */
      const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4‑digit
      const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      const registrationToken = getService("jwt").issue(
        {
          email: email.toLowerCase(),
          otpHash,
          otpExpires,
          userData,
          type: "registration"
        },
        { 
          expiresIn: '10m' // matches otpExpires
        }
      );

      /* ------------------------------------------------------------------ */
      /* 6. Send the OTP e‑mail                                             */
      /* ------------------------------------------------------------------ */
      const emailToSend = {
        to: email,
        from: process.env.EMAIL_FROM,
        replyTo: process.env.EMAIL_REPLY_TO,
        subject: "Verify your e‑mail",
        text: `Your verification code is ${otp}`,
        html: `<h1>Your verification code is ${otp}</h1>`,
      };
      await strapi.plugin("email").service("email").send(emailToSend);

      /* ------------------------------------------------------------------ */
      /* 7. Respond to the client (no DB insert yet)                        */
      /* ------------------------------------------------------------------ */
      console.log('Registration successful, sending response...');
      return ctx.send({
        message:
          "OTP sent to your e‑mail. Enter it to complete your registration.",
        registrationToken,
      });
      } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof ApplicationError || error instanceof ValidationError) {
          throw error;
        }
        // Log the full error for debugging
        console.error('Full error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          ...error
        });
        throw new ApplicationError('Registration failed. Please try again.');
      }
    }
  },

  async emailConfirmation(ctx, next, returnUser) {
    const { confirmation: confirmationToken } =
      await validateEmailConfirmationBody(ctx.query);

    const userService = getService("user");
    const jwtService = getService("jwt");

    const [user] = await userService.fetchAll({
      filters: { confirmationToken },
    });

    if (!user) {
      throw new ValidationError("Invalid token");
    }

    await userService.edit(user.id, {
      confirmed: true,
      confirmationToken: null,
    });

    if (returnUser) {
      ctx.send({
        jwt: jwtService.issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } else {
      const settings = await strapi
        .store({ type: "plugin", name: "users-permissions", key: "advanced" })
        .get();

      ctx.redirect(settings.email_confirmation_redirection || "/");
    }
  },

  async sendEmailConfirmation(ctx) {
    const { email } = await validateSendEmailConfirmationBody(ctx.request.body);

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { email: email.toLowerCase() },
      });

    if (!user) {
      return ctx.send({ email, sent: true });
    }

    if (user.confirmed) {
      throw new ApplicationError("Already confirmed");
    }

    if (user.blocked) {
      throw new ApplicationError("User blocked");
    }

    await sendConfirmationEmail(user);

    ctx.send({
      email: user.email,
      sent: true,
    });
  },

  async verifyOtp(ctx) {
    // Support both parameter naming conventions (email/identifier and otp/otpCode)
    const identifier = ctx.request.body.identifier || ctx.request.body.email;
    const otpCode = ctx.request.body.otpCode || ctx.request.body.otp;

    if (!identifier || !otpCode) {
      strapi.log.warn(
        "OTP verification failed. Both email and OTP code are required."
      );
      return ctx.badRequest(
        "Email and OTP code are required to verify your account."
      );
    }

    const existed = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        },
        // populate: ["role", "profile"],
      });

    if (!existed) {
      strapi.log.warn(
        `User not found with the provided email address [${identifier}].`
      );
      return ctx.notFound("There was no user with the provided email address.");
    }

    // Debug the OTP verification process
    console.log("Verifying OTP for:", identifier);
    console.log(
      "User record has verifyOtpToken:",
      existed.verifyOtpToken ? "[exists]" : "[missing]"
    );
    console.log(
      "User record has verifyOtpExpires:",
      existed.verifyOtpExpires
        ? new Date(existed.verifyOtpExpires).toISOString()
        : "[missing]"
    );

    const hashedToken = crypto
      .createHash("sha256")
      .update(otpCode)
      .digest("hex");

    console.log("OTP code provided:", otpCode);
    console.log(
      "Hashed token calculated:",
      hashedToken.substring(0, 10) + "..."
    );
    console.log("existed.verifyOtpToken", existed);
    console.log("hashedToken", hashedToken);
    // Check whether the generated otp token matched.
    if (
      existed.confirmationToken &&
      hashedToken === existed.confirmationToken
    ) {
      let expiresIn = new Date(existed.confirmationToken).getTime();
      // Check whether the otp code has been expired.
      if (Date.now() > expiresIn) {
        strapi.log.warn(
          `OTP verification failed. Code has expired for email [${identifier}].`
        );
        return ctx.badRequest("Your OTP Code has been expired.");
      } else {
        // Generate random token.
        const passwordToken = crypto.randomBytes(16).toString("hex");

        // Generate Jwt with expiry.
        const resetPasswordToken = getService("jwt").issue(
          { passwordToken },
          {
            expiresIn: "300s", // it will be expired after 300s
          }
        );

        // Updated otp related fields to null and set new token for reset password.
        await getService("user").edit(existed.id, {
          confirmationToken: null,
          resetPasswordToken: resetPasswordToken,
        });

        strapi.log.info(
          `OTP verification successful for email [${identifier}].`
        );
        // Then, send the authenticated token back to client.
        return ctx.send({
          data: {
            jwt: getService("jwt").issue({ id: existed.id }),
            message: "Your email has been verified.",
            code: resetPasswordToken,
            user: _.omit(existed, [
              "password",
              "resetPasswordToken",
              "confirmationToken",
              "verifyOtpToken",
            ]),
          },
        });
      }
    } else {
      strapi.log.warn("OTP verification failed. Invalid OTP.");
      return ctx.badRequest("Please enter a valid OTP.");
    }
  },

  async completeRegistration(ctx) {
    // Support both parameter naming conventions (otp/otpCode)
    const otpCode = ctx.request.body.otpCode || ctx.request.body.otp;
    const { registrationToken } = ctx.request.body;

    if (!otpCode) {
      return ctx.badRequest("OTP code is required to complete registration.");
    }

    if (!registrationToken) {
      return ctx.badRequest(
        "Registration token is required to complete registration."
      );
    }

    try {
      // Verify the JWT token to get registration data
      const payload = await getService("jwt").verify(registrationToken);

      if (!payload || !payload.email) {
        return ctx.badRequest("Invalid or expired registration token.");
      }

      // Check if the OTP is correct
      const hashedToken = crypto
        .createHash("sha256")
        .update(otpCode)
        .digest("hex");

      if (hashedToken !== payload.otpHash) {
        return ctx.badRequest("Invalid OTP code.");
      }

      // Check if OTP is expired
      if (Date.now() > payload.otpExpires) {
        return ctx.badRequest("OTP code has expired.");
      }

      // Create the new user
      const pluginStore = await strapi.store({
        type: "plugin",
        name: "users-permissions",
      });
      const settings = await pluginStore.get({ key: "advanced" });

      // Get the default role
      const role = await strapi.db
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: settings.default_role } });

      if (!role) {
        throw new ApplicationError("Impossible to find the default role");
      }

      // Create the user
      const newUser = {
        ...payload.userData,
        role: role.id,
        email: payload.email.toLowerCase(),
        username: payload.userData.username || payload.email,
        confirmed: true, // User is confirmed because they verified their email with OTP
        provider: "local",
      };

      const user = await getService("user").add(newUser);
      const sanitizedUser = await sanitizeUser(user, ctx);
      const jwt = getService("jwt").issue(_.pick(user, ["id"]));

      return ctx.send({
        jwt,
        user: sanitizedUser,
        message: "Registration completed successfully.",
      });
    } catch (error) {
      strapi.log.error("Complete registration error:", error);
      return ctx.badRequest(
        error?.message || "An error occurred during registration completion."
      );
    }
  },
});
