/**
 * Web shim for react-native-toast-notifications
 * This provides a compatible API surface for web builds
 */

// Basic toast types that match react-native-toast-notifications
type ToastType = "normal" | "success" | "danger" | "warning" | string;

interface ToastOptions {
  type?: ToastType;
  placement?: "top" | "bottom" | "center";
  duration?: number;
  animationType?: string;
  animationDuration?: number;
  onPress?: () => void;
  onHide?: () => void;
  swipeEnabled?: boolean;
}

class WebToast {
  show(message: string, options?: ToastOptions) {
    const type = options?.type || "normal";
    const duration = options?.duration || 3000;
    const placement = options?.placement || "bottom";
    
    console.log(`Toast (${type}): ${message}`);
    
    // Create a toast element
    const toastElement = document.createElement("div");
    toastElement.style.position = "fixed";
    toastElement.style.zIndex = "9999";
    toastElement.style.padding = "12px 16px";
    toastElement.style.borderRadius = "4px";
    toastElement.style.fontSize = "14px";
    toastElement.style.maxWidth = "80%";
    toastElement.style.boxShadow = "0 3px 6px rgba(0,0,0,0.16)";
    toastElement.style.transition = "all 0.3s ease-in-out";
    toastElement.style.left = "50%";
    toastElement.style.transform = "translateX(-50%)";
    
    // Set position based on placement
    if (placement === "top") {
      toastElement.style.top = "20px";
    } else if (placement === "center") {
      toastElement.style.top = "50%";
      toastElement.style.transform = "translate(-50%, -50%)";
    } else {
      toastElement.style.bottom = "20px";
    }
    
    // Set color based on type
    if (type === "success") {
      toastElement.style.backgroundColor = "#4CAF50";
      toastElement.style.color = "white";
    } else if (type === "danger" || type === "error") {
      toastElement.style.backgroundColor = "#F44336";
      toastElement.style.color = "white";
    } else if (type === "warning") {
      toastElement.style.backgroundColor = "#FF9800";
      toastElement.style.color = "white";
    } else {
      toastElement.style.backgroundColor = "#333333";
      toastElement.style.color = "white";
    }
    
    toastElement.textContent = message;
    
    // Handle click events if onPress is provided
    if (options?.onPress) {
      toastElement.style.cursor = "pointer";
      toastElement.addEventListener("click", options.onPress);
    }
    
    document.body.appendChild(toastElement);
    
    // Hide the toast after duration
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toastElement);
        if (options?.onHide) {
          options.onHide();
        }
      }, 300); // Wait for fade out animation
    }, duration);
    
    return toastElement;
  }
  
  hide(toastId?: any) {
    // No-op for basic implementation
    console.log("Toast hide called", toastId);
  }
  
  hideAll() {
    // No-op for basic implementation
    console.log("Toast hideAll called");
  }
  
  update(toastId: any, options: ToastOptions) {
    // No-op for basic implementation
    console.log("Toast update called", toastId, options);
  }
}

export function useToast() {
  // Return object with the same API as the native library
  return {
    show: (message: string, options?: ToastOptions) => {
      const toast = new WebToast();
      return toast.show(message, options);
    },
    hide: (toastId?: any) => {
      const toast = new WebToast();
      toast.hide(toastId);
    },
    hideAll: () => {
      const toast = new WebToast();
      toast.hideAll();
    },
    update: (toastId: any, options: ToastOptions) => {
      const toast = new WebToast();
      toast.update(toastId, options);
    }
  };
}

const toast = new WebToast();
export default toast;
