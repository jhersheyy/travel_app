import { initPage } from './js/app'

import './styles/resets.scss'
import './styles/style.scss'


//var mylogo = document.getElementById('jhlogo');
//mylogo.src = logo;

// Call init on DOMContentLoaded event.
window.addEventListener('DOMContentLoaded', initPage);


export {
    initPage
}