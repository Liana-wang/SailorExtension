import '../public-path'
import Search from '@/components/Search'
import { init } from '../init'

const getRoutes = (props: any) => {
    return (
        <Search appProps={ props } />
    )
}

const {
    bootstrap,
    mount,
    unmount,
} = init(getRoutes)

export {
    bootstrap,
    mount,
    unmount,
}
