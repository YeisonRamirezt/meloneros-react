function Business(props) {

    return ( 
        <div className="head_info">

			<div className="business_image">
				<img src={props.business.image} />
			</div>
			<h1 >{props.business.name}</h1>
			<h2 >{props.business.location}</h2>
			<p >{props.business.address} <br/>{props.business.city}</p>
			<div ></div>
		</div>
     );
}

export default Business;