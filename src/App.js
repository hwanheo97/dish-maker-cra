import logo from './logo.svg';
import './App.css';
import React from 'react';
import Title from './Components/Title';

//로컬 저장소에 저장하여 브라우저가 새로고침 돼도 값이 그대로 보존. 
const jsonLocalStorage = {
  setItem: (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

//open API를 javascript로 호출하는 방법
const fetchCat = async (text) => {
const OPEN_API_DOMAIN = "https://cataas.com";
const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);  //?json=true(json 으로 받기)
const responseJson = await response.json();
return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};


function MainItem (props) {    
// console.log('MainItem',props);
 return (
<li style={{listStyle:'none', display:'inline-block',marginRight:'15px'}} >
  {/*  <img src="https://cataas.com/cat/60b73094e04e18001194a309/says/react" />  */}
  <img  src={props.img} style={{width:"120px",height:'120px',}}/>
</li>
);
}
// const Title =(props) => {
// // console.log(props);
// return (
//   <h1> {props.children} </h1>
// )
// };
const Subject =(props) =>{
//  console.log('Subject',props);
return(
  <h2>{props.sub}</h2>
)
};
const Form = ({updateMaindish}) =>{
 const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
 const [value,setValue] = React.useState('');
 const [errorMessage,setErrorMessge] = React.useState('');

 function handleInputChange(e){
    //  console.log(e.target.value.toUpperCase());
    const userValue = e.target.value;
    // console.log(includesHangul(userValue));   //userValue에 한글 있는 지 검사 => true, false
    if(includesHangul(userValue)){             //userValue 한글 있는 지 검사 => true이면
      setErrorMessge("한글은 입력할 수 없습니다.");
    }else{
      setErrorMessge(" ");
    }
     setValue(userValue.toUpperCase()); //input ㅇ에 입력하는 값을 대문자로 
 }

 function handleFormSubmit(e){
    e.preventDefault();
    setErrorMessge("");
    
    if(value=== ''){   //form 검증 : validation
      setErrorMessge("빈 값으로 생성할 수 없습니다. ");
      return;   //error message보여주는 경우 중단 시키기 위해 return하고 , 없을 경우 다음 실행
    }

    updateMaindish(value);   // 사진 교체
 }
 return (
    <form onSubmit={handleFormSubmit}>
      <input 
        type="text" 
        name="name" 
        placeholder="요리명을 입력해주세요" 
        value={value}
        onChange={handleInputChange}
        />
      <button type="submit">생성</button>
      <p style={{color:'red'}}>{errorMessage}</p>
    </form>
 );
}
function Dish(props){
return(
  <li style={{listStyle:'none'}} >
    {/* <h2>수박국수</h2>   */}
    <img src={props.img} style={{width:"120px"}} />
  </li>
)
}
const MainCard =({img,onHeartClick,alreadyAddmenu}) => {
// function handleHeartMouseOver(){
//   console.log("하트 스쳐 지나감");
// }
// function handleHeartClick(){
//    console.log('App',"하트 눌렀음");
//   //setAddMenu([...addmenu,menu3]);
// }
const heartIcon = alreadyAddmenu ? "💖" : "🤍";

return(
  <div className="main-card">
    <img src ={img} alt="수박국수"  style={{width:'150px',height:'150px'}}/>
    <button onClick={onHeartClick} >{heartIcon}</button>
  </div>
);
};

function Favorites({addmenu}) {
// const menu1 = "../images/lunch_menu_09.jpg";
// const menu2 = "../images/lunch_menu_14.jpg";
// const menu3 = "../images/kimchi_fried.jpg";
// const menues =[menu1,menu2];
// console.log('Favorites',addmenu);   배열 addmenu받아 map함수로 인자(menu) 하나씩 MainItem 컴포넌트에 뿌려주기
if(addmenu.length===0){
 return <div> 사진위 하트를 눌러 시진을 저장해봐요! </div>
}
return(
  <ul>
    {addmenu.map((menu)=>(
      <MainItem img={menu}  key={menu} />
     ))}
  </ul>
)
}

// 부모 컴포넌트
const App = ()=>{
const menu1 = "../lunch_menu_09.jpg";
const menu2 = "../lunch_menu_14.jpg";
const menu3 = "../kimchi_fried.jpg";
const sub1 ="자장면";
const sub2 ="수박국수";
//const [counter, setCounter] = React.useState(Number(localStorage.getItem('counter')));   //string을 숫자로
//const [counter, setCounter] = React.useState(jsonLocalStorage.getItem('counter'));
const [image,setImage] =React.useState(menu1);
const [subject,setSubject] = React.useState(sub1);

//const [addmenu,setAddMenu] = React.useState([menu1,menu2]);
//const [addmenu,setAddMenu] = React.useState(jsonLocalStorage.getItem("addmenu")  || []);
//localStorage의 초기값은 null 이기 때문에 가져올 값이 없는 경우 빈 배열값 주기
//console.log("카운터", counter);

// localStorage에 한번만 접근 하게 하기 위해 함수 형태로 return하여 한번만 접근하게 하여 성능 높인다
const [counter,setCounter] = React.useState(()=>{
  return jsonLocalStorage.getItem('counter');
});
const [addmenu, setAddMenu] = React.useState(()=>{
  return jsonLocalStorage.getItem("addmenu")  || [];
});

//한글 변수 =>가독성 ^ . [1,2,3].includes(4); =>false
const alreadyAddmenu = addmenu.includes(image) ;

async function setInitialIamge(){
  const newCat = await fetchCat("First Image");
  console.log(newCat);
  setImage(newCat);
}

//React 컴포넌트 안에 있는 코드는 UI가 update 될때마다 계속 불린다 
//+특정 상태 업데이트 될 때만 불리게 제한 할 때 두번째인자
// []에 넣는다 , 맨 처음 앱호출 될 때 불리게할 때 [] 빈배열사용.
React.useEffect(()=>{
  setInitialIamge();
},[]);

React.useEffect(()=>{ console.log("React");},[counter]);  //counter 가 불릴때마다 

 async function updateMaindish(value){
   const newCat = await fetchCat(value);
   setImage(newCat);
  
   //const nextCounter = counter +1 ;
   //setCounter(nextCounter);

   setCounter((prev)=>{   //이전값을 갖고와서 
    const nextCounter = prev +1 ;
    jsonLocalStorage.setItem("counter",nextCounter);
    return nextCounter;// prev +1;
   })
   //jsonLocalStorage.setItem("counter",nextCounter);
   //setImage(menu2);     //
   setSubject(sub2);     //
 }

 function handleHeartClick(){
   const nextAddMenu = [...addmenu,image];   //insteadf of menu3
   //console.log('App',"하트 눌렀음");
    setAddMenu(nextAddMenu);  // javascript EC6+ spread operator 문
    jsonLocalStorage.setItem('addmenu',nextAddMenu);
}
const counterTitle = counter === null ? "" : counter + "번째";

return(
<div>
  <Title >{counterTitle} 요리수업 </Title>
  <Form updateMaindish={updateMaindish}  />
  <MainCard img={image} onHeartClick={handleHeartClick} alreadyAddmenu={alreadyAddmenu}/>  {/* props로 넘길때는 onH_____ 사용     */}
  <Favorites addmenu={addmenu}  />
  <br />
  <Subject sub={subject}  />
  <Dish img ={image}>{/*"../images/lunch_menu_14.jpg"  */}  </Dish>
</div>
    ); 
  }
export default App;
