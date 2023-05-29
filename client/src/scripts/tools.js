import {Notify} from 'quasar'

export function setToast(message,type){
  Notify.create({message,type})
}
