import { initPage } from './js/app'

import './styles/resets.scss'
import './styles/style.scss'

import mainimg from './media/travel.png'
document.querySelector('.image').setAttribute('src', mainimg);

// Call init on DOMContentLoaded event.
window.addEventListener('DOMContentLoaded', initPage);


export {
    initPage
}