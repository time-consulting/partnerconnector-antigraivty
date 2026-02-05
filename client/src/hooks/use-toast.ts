import { useState, useEffect } from "react"

export type ToastActionElement = React.ReactElement<any>

export interface ToastProps {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "destructive"
}

type ToasterToast = ToastProps & {
  id: string
}

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

let toasts: ToasterToast[] = []
let listeners: Array<(state: ToasterToast[]) => void> = []

function dispatch(toast: ToasterToast) {
  toasts = [toast, ...toasts].slice(0, TOAST_LIMIT)
  listeners.forEach((listener) => {
    listener(toasts)
  })
}

function dismiss(toastId?: string) {
  if (toastId) {
    toasts = toasts.filter((t) => t.id !== toastId)
  } else {
    toasts = []
  }
  listeners.forEach((listener) => {
    listener(toasts)
  })
}

export function toast(props: ToastProps) {
  const id = genId()

  const newToast: ToasterToast = {
    ...props,
    id,
    open: true,
  }

  dispatch(newToast)

  // Auto dismiss after delay
  setTimeout(() => {
    dismiss(id)
  }, TOAST_REMOVE_DELAY)

  return {
    id,
    dismiss: () => {
      if (toasts.some((t) => t.id === id)) {
        dismiss(id)
      }
    },
    update: (props: ToastProps) => {
      const index = toasts.findIndex((t) => t.id === id)
      if (index !== -1) {
        toasts[index] = { ...toasts[index], ...props }
        listeners.forEach((listener) => {
          listener(toasts)
        })
      }
    },
  }
}

export function useToast() {
  const [state, setState] = useState<ToasterToast[]>(toasts)

  // Subscribe to toast updates
  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toasts: state,
    toast,
    dismiss,
  }
}
