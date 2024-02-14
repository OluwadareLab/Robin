import React from 'react';
import { Card } from 'react-bootstrap';
import { STATUSES } from '../../api/apiConfig.js';
import { BtnLink } from '../buttons/BtnLink';
import { paths } from '../../config.mjs';

type JobProps = {
  id: number;
  status: string;
  title: string;
  description: string;
  email?: string;
  date?: string;
}

export const JobDisplay = (props:JobProps) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>ID: {props.id}</Card.Text>
        <Card.Text>Status: {props.status}</Card.Text>
        <Card.Text>Description: {props.description}</Card.Text>
        {props.date!=='null' && props.date ? <Card.Text>Date: {props.date}</Card.Text>:""}
        {props.email!=='null' && props.email ? <Card.Text>Email: {props.email}</Card.Text> : ""}
        {props.status === STATUSES.DONE ? <BtnLink src={`${paths.results}/${props.id}`} title="viewJob" />:""}
      </Card.Body>
    </Card>
  );
};