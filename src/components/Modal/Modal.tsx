import {FC} from "react";
import {createCn} from "../../utils";

import './Modal.css';

const cn = createCn('modal');

export const Modal: FC = ({ children }) => (
    <div className={cn()}>
        <div className={cn('popup')}>
            { children }
        </div>
    </div>
);