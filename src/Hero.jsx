function Hero(){

    return(
        <div style={{display:"flex" , justifyContent:"space-between" , alignItems:"center" , padding:"20px" , backgroundColor:"#f5f5f5"}}>
           <div>
               <h1 style={{color:"#333" , fontSize:"2.5rem" , marginBottom:"10px"}}>Welcome to Our Store</h1>
               <p style={{color:"#666" , fontSize:"1.2rem" , marginTop:"30px"}}>Discover amazing furniture for your home </p>
               <div style={{display:"flex" , gap:"10px" , marginTop:"50px"}}>
                     <button style={{backgroundColor:"#007bff" , color:"#fff" , border:"none" , padding:"10px 20px" , cursor:"pointer"}}>SHOP NOW</button>
                     <button style={{backgroundColor:"#6c757d" , color:"#fff" , border:"none" , padding:"10px 20px" , cursor:"pointer"}}>ABOUT US</button>
               </div>
           </div>
            <div>
                <img src="https://tse3.mm.bing.net/th/id/OIP.ny25Uwr54NqjJKEo17SnGgHaEP?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Hero Image" style={{width:"400px" , height:"300px"}} />
            </div>
        </div>
      );  
}

export default Hero