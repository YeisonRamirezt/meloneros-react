import { useState, useEffect } from "react";
import Nav from './store/nav'
import Business from './store/business'
import Categories from './store/categories'
import Products from './store/products'
import BusinessModel from './business.model'
import './online-store.css'

function OnlineStore() {
    const [category, setCategory] = useState(1);

    const categoryId = (id) =>{
        setCategory(id)
    }

    const getObjects = (array) =>{
        array.map(arr => arr)
    }

    return ( 
        <div>
            <Nav></Nav>
            <Business business={BusinessModel.business}></Business>
            <Categories categories={BusinessModel.categories} selectedCategory={category} categoryId={(id)=>categoryId(id)}></Categories>
            <Products categories={BusinessModel.categories} selectedCategory={category}></Products>
        </div>
     );
}

export default OnlineStore;