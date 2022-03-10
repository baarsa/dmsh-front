import {NavigationVM} from "../../view-models/NavigationVM";
import {Link, useLocation} from "react-router-dom";

export const Navigation = (props: { vm: NavigationVM }) => {
    const location = useLocation();
    return (
        <nav>
            {
                props.vm.items.map(item =>
                    <Link key={item.url} className={location.pathname === item.url ? 'active' : 'passive'} to={item.url}>{item.text}</Link>
                )
            }
        </nav>
    );
}