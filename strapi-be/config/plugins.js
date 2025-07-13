module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "@strapi/provider-email-mailgun",
      providerOptions: {
        username: "api",
        key: env("MAIL_GUN_API_KEY"),
        domain: env("MAILGUN_DOMAIN"),
      },
      settings: {
        defaultFrom: `noreply@${env("MAILGUN_DOMAIN")}`,
        defaultReplyTo: `support@${env("MAILGUN_DOMAIN")}`,
      },
    },
  },

  upload: {
    config: {
      tmpFileDirectory: "./tmp_uploads",
      optimize: false,
      sizeLimit: 250 * 1024 * 1024,
      provider: "strapi-provider-upload-minio-ce",
      providerOptions: {
        accessKey: env("MINIO_ACCESS_KEY"),
        secretKey: env("MINIO_SECRET_KEY"),
        bucket: env("MINIO_BUCKET"),
        endPoint: env("MINIO_ENDPOINT"),
        port: env.int("MINIO_PORT", 443),
        useSSL: env.bool("MINIO_USE_SSL", true),
        s3ForcePathStyle: true,
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
