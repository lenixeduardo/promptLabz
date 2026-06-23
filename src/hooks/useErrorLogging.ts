import { useCallback } from "react"
import { errorLogger } from "@/lib/errorLogging"
import { useAuth } from "./useAuth"

export function useErrorLogging() {
  const { user } = useAuth()
  const userId = user?.id

  const logError = useCallback(
    (error: unknown, context: string) => {
      errorLogger.logError(error, context, userId)
    },
    [userId]
  )

  const logApiError = useCallback(
    (endpoint: string, statusCode: number, error: unknown) => {
      errorLogger.logApiError(endpoint, statusCode, error, userId)
    },
    [userId]
  )

  const logRateLimit = useCallback(
    (endpoint: string, retryAfter?: number) => {
      errorLogger.logRateLimit(endpoint, retryAfter, userId)
    },
    [userId]
  )

  const logAuthEvent = useCallback(
    (eventType: "login" | "logout", success: boolean) => {
      if (userId) {
        errorLogger.logAuthEvent(eventType, userId, success)
      }
    },
    [userId]
  )

  const logSettingsChange = useCallback(
    (setting: string, oldValue: unknown, newValue: unknown) => {
      if (userId) {
        errorLogger.logSettingsChange(userId, setting, oldValue, newValue)
      }
    },
    [userId]
  )

  return {
    logError,
    logApiError,
    logRateLimit,
    logAuthEvent,
    logSettingsChange,
  }
}
