import { toast } from "react-toastify";
import { IShowToast } from "../types/ISysTypes";
import defaultAvatar from '../assets/images/avatar-def.png';

const classList = (...args: string[]) => {
    return args.join(' ');
};

const transformArtistId = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(hash.length - 4)}`;
};

const isEqual = (object1, object2) => {
  const props1 = Object.getOwnPropertyNames(object1);
  const props2 = Object.getOwnPropertyNames(object2);

  if (props1.length !== props2.length) {
    return false;
  }

  for (let i = 0; i < props1.length; i += 1) {
    const prop = props1[i];
    const bothAreObjects = typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object';

    if ((!bothAreObjects && (object1[prop] !== object2[prop]))
    || (bothAreObjects && !isEqual(object1[prop], object2[prop]))) {
      return false;
    }
  }

  return true;
}

const showToast = (params: IShowToast) => {
  toast(params.message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: params.type,
  });
}

const validateDotNum = (element) => {
  let stringVal = element.value.trim();

  stringVal = stringVal.replace(/[^0-9\,.]/g, '');
  stringVal = stringVal.replace(/,/gi, '.');

  element.value = stringVal;
}

const isValidEmail = (value: string) => {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (value.match(mailFormat)) return true;
    
  return false;
};

const changeAvatarRefSrc = (ref) => {
  try {
    ref.current.src = defaultAvatar;
  } catch (e) { console.warn(e) }
}

export {
  classList,
  transformArtistId,
  isEqual,
  showToast,
  validateDotNum,
  isValidEmail,
  changeAvatarRefSrc
};
