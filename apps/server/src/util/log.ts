type LogLevel = "info" | "error";

const formatError = (err: unknown) => {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }

  if (typeof err === "string") {
    return {
      message: err,
    };
  }

  if (typeof err === "object" && err !== null) {
    return {
      message: "Non-Error object thrown",
      value: err,
    };
  }

  return {
    message: "Unknown error type",
    value: err,
  };
};

const baseLog = (
  level: LogLevel,
  message: string,
  err?: unknown
) => {
  const payload: Record<string, unknown> = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (err !== undefined) {
    payload.error = formatError(err);
  }

  const output = JSON.stringify(payload, null, 2);

  if (level === "error") {
    console.error(output);
  } else {
    console.log(output);
  }
};

export const log = {
  info(message: string) {
    baseLog("info", message);
  },

  error(message: string, err?: unknown) {
    baseLog("error", message, err);
  },
};
