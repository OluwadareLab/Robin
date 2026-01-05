import { Accordion, AccordionBody, AccordionItem, Button } from "react-bootstrap";
import { InstructionHeader } from "../misc/instructionHeader";
import React from "react";

export const AiInstructions = () =>
    <>
        <InstructionHeader title='An AI Assistant for data visualization' />
        <Accordion>
            <AccordionItem eventKey='preview'>
                <Accordion.Header>Detailed Instructions</Accordion.Header>
                <AccordionBody>
                    <p>You may ask the AI to generate additional graphs and data visualizations for your data, it will write code that will execute and draw graphs from the data.
                        Keep in mind Large Language models do not particularly "know" what they are saying and often do not hold much regard for truth. Make sure to double check any result produced by the AI.
                        <hr />
                        When prompting, be specific as to what you want and what data you want it to use. It has acsess to all data assosiated with your job.
                        <hr />
                        DO NOT: tell the AI to write in a langauge other than python or tell it to use specific packages, it only has access to a few predownloaded packages.
                        <hr />
                        An easy way to test this tool is to ask it to generate a graph we have already properly created, for instance "Please generate a line graph of loop size compared to resolution"
                    </p>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    </>