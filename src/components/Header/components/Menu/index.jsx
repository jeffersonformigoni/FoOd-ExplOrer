import * as Dialog from '@radix-ui/react-dialog'
import close from '../../../../assets/icons/close.svg'

import { useAuth } from '../../../../contexts/auth'

import { LinkText } from '../../../LinkText'
import { Footer } from '../../../Footer'

import { Content } from './styles'
import { Search } from '../Search'

export function Menu({ onCloseMenu, onSetSearch }) {
  const { user, signOut } = useAuth()

  function handleSignOut() {
    signOut()
  }

  return (
    <Dialog.Portal>
      <Content>
        <header>
          <Dialog.Close asChild>
            <button>
              <img src={close} alt="menu close" />
            </button>
          </Dialog.Close>
          <Dialog.Title>Menu</Dialog.Title>
        </header>
        <div className="menu-content">
          <Search onSetSearch={onSetSearch} />

          <ul>
            {user.isAdmin && (
              <li>
                <LinkText name="Novo prato" to="/new" onClick={onCloseMenu} />
              </li>
            )}
            {!user.isAdmin && (
              <li>
                <LinkText
                  name="Histórico de pedidos"
                  to="/requests"
                  onClick={onCloseMenu}
                />
              </li>
            )}
            {!user.isAdmin && (
              <li>
                <LinkText
                  name="Meus favoritos"
                  to="/favorites"
                  onClick={onCloseMenu}
                />
              </li>
            )}

            <li>
              <LinkText name="Sair" to={'/'} onClick={handleSignOut} />
            </li>
          </ul>
        </div>
        <Footer />
      </Content>
    </Dialog.Portal>
  )
}
