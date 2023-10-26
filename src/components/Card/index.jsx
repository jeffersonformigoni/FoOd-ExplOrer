import { FiHeart } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useAuth } from '../../contexts/auth'
import { api } from '../../services/api'

import Edit from '../../assets/icons/pencil.svg'
import photoPlaceholder from '../../assets/photoPlaceholder.png'

import { Counter } from '../Counter'
import { Button } from '../Button'

import { Container } from './styles'
import { PurchaseContext } from '../../contexts/purchase'
import { useContextSelector } from 'use-context-selector'

export function Card({ dish }) {
  const [favorite, setFavorite] = useState(false)
  const [idFavorite, setIdFavorite] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [inCart, setInCart] = useState(false)

  const { user } = useAuth()
  const { createRequest, userRequests } = useContextSelector(
    PurchaseContext,
    ({ createRequest, userRequests }) => ({ createRequest, userRequests }),
  )

  const photoUrl = dish.photo
    ? `${api.defaults.baseURL}/files/${dish.photo}`
    : photoPlaceholder

  async function handleRequest() {
    await createRequest({ quantity, dishId: dish.id })
  }

  async function handleFavorite() {
    if (favorite) {
      await api.delete(`/favorites/${idFavorite}`)
      setFavorite(false)
    } else {
      const id = await api
        .post('/favorites', { dish_id: dish.id })
        .then((res) => res.data)
      setFavorite(true)
      setIdFavorite(id)
    }
  }

  useEffect(() => {
    const request = userRequests.find(
      (requests) => requests.dish_id === dish.id,
    )
    if (request) {
      setQuantity(request?.quantity)
      setInCart(true)
    } else {
      setInCart(false)
    }
  }, [userRequests, dish.id])
  useEffect(() => {
    async function fetchFavorites() {
      const response = await api.get('/favorites')

      const favorite = response.data.find(
        (favorite) => favorite.dish_id === dish.id,
      )
      setFavorite(!!favorite)
      setIdFavorite(favorite ? favorite.id : null)
    }

    fetchFavorites()
  }, [dish.id])

  return (
    <Container inCart={inCart}>
      {user.isAdmin ? (
        <button>
          <Link to={`/edit/${dish.id}`}>
            <img src={Edit} alt="" />
          </Link>
        </button>
      ) : (
        <button onClick={handleFavorite}>
          <FiHeart className={favorite ? 'fav' : ''} />
        </button>
      )}

      <Link to={`/dish/${dish.id}`}>
        <img src={photoUrl} alt={dish.name} />
        <h3>{dish.name} &gt;</h3>
        <p>{dish.description}</p>
        <span>
          {dish.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </Link>
      {!user.isAdmin && (
        <div>
          <Counter quantity={quantity} setQuantity={setQuantity} />
          <Button
            title={inCart ? 'alterar' : 'incluir'}
            onClick={handleRequest}
          />
        </div>
      )}
    </Container>
  )
}
