console.log("chlo jiiiiii");

const userTab = document.querySelector("[data-user]");
const searchTab =document.querySelector("[data-search]") ;
const userContainer = document.querySelector(".weather-container");
const grantAccess =document.querySelector(".grant-location-container");
const searchFrom = document.querySelector("[dataSearch]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


let currentTab = userTab;

const API ="72b97ec0d6576b721aadd7c30fd55325";

currentTab.classList.add("current-tab");

getfromSessionStorage();

function switchtab(newTab){
  if(newTab != currentTab)
  {
    currentTab.classList.remove("current-tab");
    currentTab = newTab;
    currentTab.classList.add("current-tab");

    if(!searchFrom.classList.contains("active"))
    {
        userInfoContainer.classList.remove("active");
        grantAccess.classList.remove("active")
        searchFrom.classList.add("active");
       
    }

    else{
      searchFrom.classList.remove("active")
      userInfoContainer.classList.remove("active");
      getfromSessionStorage();

    }

  }

}

userTab.addEventListener("click", ()=> {
  switchtab(userTab);
  console.log("usertab has  been clicked");
});

searchTab.addEventListener("click",()=>{
  switchtab(searchTab);
});


function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates)
  {
    grantAccess.classList.add("active");

  } 

   else
   {
    const coordinates  = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
   }


}


async function fetchUserWeatherInfo(coordinates)
{
  const {lat,lon} = coordinates;
  // grant accesss invisible
  grantAccess.classList.remove("active");
  loadingScreen.classList.add("active");

  try{
    const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
  
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    rendering(data);
    
  }
  catch(error){ 
    console.error("gadbad hogyi lat long ni diya ");
  }
}

function rendering(data){
  loadingScreen.classList.remove("active");
    
  const cityName = document.querySelector("[data-city-name]");
  const countryflag = document.querySelector("[country-flag]");
  const desc = document.querySelector("[data-weather-desc]");
  const weatherIcon = document.querySelector("[data-weather-desc-img]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloud = document.querySelector("[data-cloud]");

  console.log(cloud);
  if(data?.name == undefined)
  {
    error.classList.add("active");
  }
 else
 {
  userInfoContainer.classList.add("active");
  cityName.innerText =  data?.name;
  countryflag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  desc.innerText = data?.weather?.[0]?.description;
  weatherIcon.src= `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  temp.innerText = `${data?.main?.temp} °C`;
  windspeed.innerText = `${data?.wind?.speed} m/s`;
  humidity.innerText =`${data?.main?.humidity}%`;
  cloud.innerText =`${data?.clouds?.all}%`;
  error.classList.remove("active");
  console.log(cloud);
 }

}

const grantbutton = document.querySelector("[dataGrant]");
grantbutton.addEventListener("click", getLocation);


function getLocation(){
         if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(showPosition);
         }
         else{
          alert("cant acess location");
         }
      
}
function showPosition(position){
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);

}


const searchinput = document.querySelector("[dataSearchInput]");
searchFrom.addEventListener("click",(e)=>{
    e.preventDefault();
    let city = searchinput.value;
    if(city ==="")
    {
      return;
    }

    else{
      fetchDetails(city);
    }}
)

const error= document.querySelector("[error]");


async function fetchDetails(city){

  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccess.classList.remove("active");
  try{
    
    const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`);
    const data = await response.json();
    
    rendering(data);
    
  }
  catch(error){ 
    console.error("gadbad hogyi");
    
    
  }

 
  
}
