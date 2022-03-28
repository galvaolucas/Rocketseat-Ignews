import styles from "./styles.module.scss";
import { api } from '../../services/api';
import { useSession , signIn } from 'next-auth/react';
import { getStripeJs } from "../../services/stripe-js";

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId } : SubscribeButtonProps){

    const session = useSession()
    
    async function handleSubscribe() {
        if(!session) {
            signIn('github')
            return;
        }

        //criação da checkout session
        try {
            const response = await api.post('/subscribe')

            const { sessionId } = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({ sessionId: sessionId });
        } catch (err) {
            alert(err.message);
        }
    }


    return (
        <button
        type = "button"
        onClick={handleSubscribe}
        className = {styles.subscribeButton}>
            Subscribe
        </button>
    );

}