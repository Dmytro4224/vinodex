import { toast } from 'react-toastify';
import { IShowToast } from '../types/ISysTypes';
import defaultAvatar from '../assets/images/avatar-def.png';
import { IMetaData } from '../types/ITokenCreateItem';
import Big from 'big.js';

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
    const bothAreObjects = typeof (object1[prop]) === 'object' && typeof (object2[prop]) === 'object';

    if ((!bothAreObjects && (object1[prop] !== object2[prop]))
      || (bothAreObjects && !isEqual(object1[prop], object2[prop]))) {
      return false;
    }
  }

  return true;
};

const showToast = (params: IShowToast) => {
  toast(params.message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: params.type,
  });
};

const validateDotNum = (element) => {
  element.value = element.value.replace(/^\.|[^\d\.]|\.(?=.*\.)|^0+(?=\d)/g, '');
};

const onlyNumber = (element) => {
  let stringVal = element.value.trim();

  stringVal = stringVal.replace(/[^0-9]/g, '');

  element.value = stringVal;
};

const isValidEmail = (value: string) => {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (value.match(mailFormat)) return true;

  return false;
};

const changeAvatarRefSrc = (ref) => {
  try {
    ref.current.src = defaultAvatar;
  } catch (e) {
    console.warn(e);
  }
};

const videoFileTypes = ['video/mp4'];
const isVideoFile = (type: string) => {
  return videoFileTypes.indexOf(type) !== -1;
};

const mediaUrl = (metadata: IMetaData): string => {
  if (metadata.extra) {
    try {
      const json = JSON.parse(metadata.extra);
      if (json && json.media_lowres) {
        return json.media_lowres;
      }
    }
    catch (ex) {
      console.error('mediaUrl ex =>', ex);
    }
  }
  return metadata.media;
};

const formatDate = (date) => {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

const convertYoctoNearsToNears = (yoctoNears, precision = 2) => {
  return new Big(yoctoNears)
    .div(10 ** 24)
    .round(precision)
    .toString();
};

export {
  classList,
  transformArtistId,
  isEqual,
  showToast,
  validateDotNum,
  isValidEmail,
  changeAvatarRefSrc,
  isVideoFile,
  onlyNumber,
  mediaUrl,
  formatDate,
  convertYoctoNearsToNears
};

