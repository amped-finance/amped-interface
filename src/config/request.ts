export const requestController = async (
  request: any,
  options?: {
    timeout?: number;
    onTimedOut?: () => any;
    onError?: (error: any) => any;
  }
) => {
  const controller = new AbortController();

  const signal = controller.signal;

  const cancel = () => {
    controller.abort();
  };

  let timer: any = null;
  try {
    if (options?.timeout) {
      const timeout = options.timeout ?? 0;

      timer = setTimeout(() => {
        cancel();
        options?.onTimedOut?.();
      }, timeout);
    }

    const res = await request({ signal });

    return {
      success: true,
      data: res,
      error: null,
    };
  } catch (error: any) {
    options?.onError?.(error);

    return {
      success: false,
      data: null,
      error,
    };
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};
