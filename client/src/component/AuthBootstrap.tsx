import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { supabase } from "../App";
import { logout, setInitialized, setSession } from "../store/authSlice";

export default function AuthBootstrap({
    children,
}:{
    children: ReactNode
}){
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true;

        async function restoreSession() {
            const { data, error } = await supabase.auth.getSession();

            if (!isMounted) {
                return;
            }

            if (error || !data.session) {
                dispatch(logout());
                return;
            }

            try {
                const response = await axios.post('/api/auth/login', {
                    supabaseId: data.session.user.id,
                }, {
                    headers: {
                        Authorization: `Bearer ${data.session.access_token}`,
                    },
                });

                if (!isMounted) {
                    return;
                }

                dispatch(setSession({
                    supabaseSession: data.session,
                    backendJWTToken: response.data.token,
                    user: {
                        ...response.data.user,
                    },
                }));
            } catch (bootstrapError) {
                console.error(bootstrapError);
                dispatch(logout());
            }
        }

        restoreSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) {
                return;
            }

            if (event === 'SIGNED_OUT' || !session) {
                dispatch(logout());
                return;
            }

            if (event === 'INITIAL_SESSION') {
                return;
            }

            try {
                const response = await axios.post('/api/auth/login', {
                    supabaseId: session.user.id,
                }, {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                });

                if (!isMounted) {
                    return;
                }

                dispatch(setSession({
                    supabaseSession: session,
                    backendJWTToken: response.data.token,
                    user: {
                        ...response.data.user,
                    },
                }));
            } catch (authError) {
                console.error(authError);
                dispatch(logout());
            }
        });

        dispatch(setInitialized(false));

        return () => {
            isMounted = false;
            authListener.subscription.unsubscribe();
        };
    }, [dispatch]);

    return <>{children}</>;
}
