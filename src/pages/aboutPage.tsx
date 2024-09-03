import React from "react";

export const AboutPage = () => <>
    <div id ="AboutPage">
        <br />
        <ul>
            <li><p>Chromosome loop analysis has emerged in the interest of researchers in recent years.</p></li>
            <li><p>Recently, our lab published a comparative study, Chowdhury et al. 2024, where we compared different types of loop caller tools:   <a href="https://doi.org/10.1186/s12859-024-05713-w" rel="noopener noreferrer" target="_blank">Comparative study on chromatin loop callers using Hi-C data reveals their effectiveness</a></p></li>
            <li><p>Since we published this comparative study,  Chowdhury et al. 2024, there has been much demand for the code and for a ready-to-use on-the-go platform to reproduce the analysis results for future loop caller analysis.</p></li>
            <li><p>Hence, we propose Robin to meet this demand.</p></li>
        </ul>
        <dl >
            <p>Robin has been developed to serve as a reliable and easy to use platform that fulfills the need for a comparable and powerful loop caller analysis tool. The plots created by Robin for analysis are of good quality and are publication ready. Overall, Robin is:</p>
            <ul>
                <li><p>User-friendly and easy to use with a modern web interface.</p></li>
                <li><p>Removes boilerplate codes for different analyses.</p></li>
                <li><p>Provides downloadable high-resolution plots.</p></li>
                <li><p>Provides ready-to-use plots for loop caller analysis such as Overlap, Regression, and Recovery plots.</p></li>
                <li><p>HiGlass integrated to visualize the loop caller results with different ChIP signals.</p></li>
                <li><p>LLM integrated that allows the users to generate more plots with their needs using the uploaded data.</p></li>
            </ul>
        </dl>
    </div>
</>