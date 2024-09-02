import React from "react";
import ErrorPage from "../../pages/errPage";
import { ErrorBoundary } from "react-error-boundary";

export function StandardErrorBoundary(props) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorPage}
            onError={(error, errorInfo) => {
                // log the error
                console.log("Error caught!");
                console.error(error);
                console.error(errorInfo);
            }}
            onReset={() => {
                // reloading the page to restore the initial state
                // of the current page
                console.log("reloading the page...");
                window.location.reload();

                // other reset logic...
            }}
        >
            {props.children}
        </ErrorBoundary>
    );
}