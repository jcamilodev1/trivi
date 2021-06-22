import { dama } from ".../../../modules/dama";
import { apiService } from "../services/api";
/**
 * Use Petition
 * 
 * You must use pet.get(url) or pet.post(url, data) 
 */
const api = new apiService();
/**
 * Use Dama
 * 
 * Dama has a lot of function to help to developer, this function you can get in the next url
 * 
 */
const dm = new dama();

export const page = async () => {
  console.log('Api:', api.example())
  console.log('Dama:', dm.welcome())

  // Added Background Shapes
  document.body.insertAdjacentHTML('beforeend', '<ul class="circles"><li></li><li></li><li></li><li></li></ul>');

  setCountdown()
}

function setCountdown(): void {
  let time: number = 120;
  let countdownClass: string = 'countdown';

  const calculateTime = (secs: number): string => {
    const minutes: number = Math.floor(secs / 60);
    const seconds: number = Math.floor(secs % 60);
    const returnedSeconds: string = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  }

  let timeString: string = calculateTime(time);
  let refCountdownContainer = document.querySelector(`.${countdownClass} .${countdownClass}__text`);
  refCountdownContainer.innerHTML = timeString
}



