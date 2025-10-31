import { FormEvent, useState, useTransition } from 'react'

interface IFormState {
  success: boolean
  message: string | null
  errors: Record<string, string[] | undefined> | null
}

export function useFormState(
  action: (data: FormData) => Promise<IFormState>,
  onSuccess?: () => Promise<void> | void,
  initialState?: IFormState
) {
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState<IFormState>(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    }
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const state = await action(data)

      if (state.success === true) {
        // Reset do form deve ser feito de forma síncrona
        form.reset()

        if (onSuccess) {
          await onSuccess()
        }
      }

      setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
