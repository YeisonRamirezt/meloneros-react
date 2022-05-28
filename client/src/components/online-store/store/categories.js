function Categories(props) {
    const showCategory = (cNm,cN) =>{
        alert(cN);
    }
    const w = (slct, id)=>{
        if (slct == id){
            return 'cat-design selected-category'
        }else{
            return 'cat-design'
        }
    }
    return ( 
        <div id='categories'>
			{props.categories.map(category =>{
                return(
                    <div key={category.id} className={w(props.selectedCategory,category.id)} onClick={(id)=>props.categoryId(category.id)}>
                        {category.name}
                    </div>
                )
            })}
        </div>
     );
}

export default Categories;