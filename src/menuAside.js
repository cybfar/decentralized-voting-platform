import { mdiMonitor, mdiSquareEditOutline } from '@mdi/js'
import { useMetaMaskStore } from '@/stores/account'

export default function getMenuItems() {
  const menuItems = [
    {
      to: '/dashboard',
      icon: mdiMonitor,
      label: 'Dashboard'
    }
  ]
  const account_store = useMetaMaskStore()
  if (account_store.isAdmin) {
    menuItems.push({
      to: '/managevote',
      label: 'Manage Vote',
      icon: mdiSquareEditOutline
    })
  }

  return menuItems
}
