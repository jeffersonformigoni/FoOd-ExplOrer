import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { LinkText } from '../../components/LinkText'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '../../contexts/auth'

import { Container, Form } from './styles'
import { useForm } from 'react-hook-form'

const signInSchema = zod.object({
  email: zod.string(),
  password: zod.string().min(6, 'Informe uma senha válida!'),
})

export function SignIn() {
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleSignIn(data) {
    await signIn({ email: data.email, password: data.password })
  }

  return (
    <Container>
      <h1>
        <svg
          width="39"
          height="44"
          viewBox="0 0 39 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.6574 0L38.4133 10.8287V32.4862L19.6574 43.3149L0.901548 32.4862V10.8287L19.6574 0Z"
            fill="#065E7C"
          />
        </svg>
        food explorer
      </h1>
      <Form onSubmit={handleSubmit(handleSignIn)}>
        <h2>Faça login</h2>

        <Input
          type="email"
          id="email"
          label="Email"
          placeholder="exemplo@exemplo.com.br"
          required
          {...register('email')}
        />

        <Input
          type="password"
          id="password"
          label="Senha"
          placeholder="No mínimo 6 caracteres"
          minLength="6"
          required
          {...register('password')}
        />
        <Button title="Entrar" disabled={isSubmitting} />
        <LinkText name="Criar uma conta" to="/register" />
      </Form>
    </Container>
  )
}
