import React from 'react'
import db from "../firebase"
import "./PlanScreen.css"
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import {loadStripe} from "@stripe/stripe-js";

function PlanScreen() {
    const [products, setProducts] = useState([]);
    const user =  useSelector(selectUser);
    const [subscription, setSubscription] = useState(null)

    useEffect(() => {
        db.collection('customers').doc(user.uid).collection('subscriptions')
        .get().then(
            querySnapshot => {
                querySnapshot.forEach(async subscription => {
                    setSubscription({
                        role: subscription.data().role,
                        current_period_end: subscription.data().current_period_end.seconds,
                        current_period_start: subscription.data().current_period_start.seconds,
                    })
                })
            });
    }, [user.uid])
    

    useEffect(() => {
        db.collection("products").where('active', '==', true)//according to db
            .get().then((querySnapShot) => {
                const products = {};
                querySnapShot.forEach(async productDoc => {
                    products[productDoc.id] = productDoc.data();
                    const priceSnap = await productDoc.ref.collection('prices').get();
                    priceSnap.docs.forEach(price => {
                        products[productDoc.id].prices = {
                            priceId: price.id,
                            priceData: price.data()
                        }
                    })
                });
                setProducts(products);
            });
    }, []);

    console.log(products)
    console.log(subscription);

    const loadCheckout = async (priceId)=>{
        const docRef =  await db.collection('customers').doc(user.uid).collection('checkout_sessions')
            .add({
                price:priceId,
                success_url: window.location.origin, 
                cancel_url: window.location.origin,
            });
        docRef.onSnapshot(async(snap)=>{
            const {error, sessionId} = snap.data();

            if(error){
                //Show an error to your customer and inspect
                //your Cloud Function logs in the Firebase console.
                alert(`An error occured: ${error.message}`);
            }
            if(sessionId){
                //We have a session, let's redirect to Checkout
                //Init Stripe 

                const stripe = await loadStripe("pk_test_51ODYrBAqlduAjKQGV6GL8dSDMCfJ3qWlYmyTiOhQE7GBS468mv7oLNS9SCFzeP8HT3TIN88HQjWQDe4bHPzghN7I00pNbhsiWU")
                stripe.redirectToCheckout({sessionId});
            }
        })
    
    }

    return <div className='planScreen'>
            <br/>
            {
            //render the renewal date only if you are subscribed
            subscription && (<p>Renewal date: {""}
                {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>)} 
            {Object.entries(products).map(([productId, productData])=>{
                //TODO: add some logic to check if the user's subscription is active...

                const isCurrentPackage = productData.name?.toLowerCase()
                .includes(subscription?.role)

                return(
                    //the key for div that were are going to render in the list is the unique productID
                    <div key={productId} className={`${isCurrentPackage && "planScreen__plan--disabled"}planScreen__plan`}> 
                        <div className='planScreen__info'>
                            <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                        </div>
                        <button onClick={()=>
                            !isCurrentPackage && loadCheckout(productData.prices.priceId)} >
                            {isCurrentPackage ? 'Current Package': 'Subscribe'}
                            </button>
                    </div>
                )
            })} 
        </div>
    }


export default PlanScreen