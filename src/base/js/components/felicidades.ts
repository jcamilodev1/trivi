import { dama } from ".../../../modules/dama";
import { apiService } from "../services/api";
import ClipboardJS from "clipboard"
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
  console.log("felicidadd")
  // Added Background Shapes
  document.body.insertAdjacentHTML('beforeend', '<ul class="circles"><li></li><li></li><li></li><li></li></ul>');
  new ClipboardJS('.code-btn');
}



