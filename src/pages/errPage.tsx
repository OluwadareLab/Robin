import React from "react";
import { AppNavbar } from "../components/navbar/Navbar";
import { Footer } from "../components/Footer/footer";

export default function ErrorPage(props) {
    return (
        <>
            <AppNavbar />
            <div className={"error-page"}>
                <div className={"oops"}>Oops!</div>
                <div className={"message"}>Something went wrong...</div>
                {props.resetErrorBoundary && (
                    <div>
                        <button className={"retry-button"} onClick={props.resetErrorBoundary}>
                            🔄 Try Again?
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}