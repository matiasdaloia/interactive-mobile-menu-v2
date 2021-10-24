module.exports = `body{
    margin:0;   
}

a{
    text-decoration: none !important;
    color: #000 !important;
}

.hide{
    display: none;
}

@media (min-width:200px) and (max-width:740px){
    .matias-navigation{
        z-index: 9999999999;
        margin-top: 0px;
        top: 0;
        width: 100%;
        text-align: center;
        padding-top: 0px;
		height: 100%;
        position: fixed;
        background: #FFF;
        overflow: auto;
    }
}

nav.matias-navigation ul{
    list-style: none;
    width: 100%;
    margin: 0px auto;
}

.matias-navigation__logo{
    width: 100%;
    float: none;
    text-align: center;
    margin: 0px auto;
    background: #000;
    padding-top: 10px;
    padding-bottom: 10px;
}

.matias-navigation__logo a img {
    max-width: 60px;
}

.matias-navigation__logoCloseMobile{
    width: 25%;
    left: 0px;
    position: absolute;
    top: 30px;
    right: 0px;
    z-index: 999;
}

.matias-navigation__logoCloseMobile img {
    width: 20px;
    cursor: pointer;
}

.matias-navigation__upperMenu{
    display: flex;
}

.matias-navigation__upperMenu ul li {
    position: relative;
    width: 31.50%;
    max-width: 170px;
    float: left;
    font-family: 'Asap', sans-serif;
    font-weight: 700;
    margin: 15px 10px 10px;
    transition: 0.3s ease-in-out;
    padding: 0 3px;
    outline: none;
}

.matias-navigation__upperMenu ul li img {
    border-radius: 5px;
    max-height: 85px;
    height: 85px;
    width: 100%;
    object-fit: cover;
}

.matias-navigation__upperMenu ul li span {
    position: absolute;
    top: 50%;
    transform: translate(0px , -50%);
    left: 12px;
}

.matias-navigation__upperMenu ul li span a {
    padding: 4px 7px;
    border-radius: 3px;
    background-color: #fff;
    text-transform: uppercase;
    font-size: 12px;
    color: black;
    text-decoration: none;
}


.accordion-content{
    display: none;
    padding: 0 8px;
    flex-direction: column;
    margin: 10px 0 0 0;
}

.accordion-content11{
    display: block;
}

.accordion-row{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    background-color: #f2f2f2;
    padding-left: 10px;
    min-height: 90px;
    line-height: 90px;
    text-transform: uppercase;
    font-family: 'Asap', sans-serif;
    font-weight: 700;
    color: #000;
    border-radius: 3px;
    margin-bottom: 6px;
}

.accordion-row img {
    max-height: 100px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}

.animate__animated.animate__fadeInLeft {
    --animate-duration: 0.75s;
}
  
.matias-navigation__upperMenu ul {
    padding-left: 0 !important;
}
 
.shifter-open{
  overflow:hidden;
  display:block;
}`;
