import React from 'react';
import { getDefaultNormalizer, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm/>)
});

test('renders the contact form header', () => {
    render(<ContactForm/>)

    const header = screen.getByText(/contact form/i);

    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>)

    const firstNameInput = screen.getByLabelText(/first Name*/i);
    userEvent.type(firstNameInput, "err");

    const errorMessages= await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>)

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton)    

    const errorMessages= await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(3);

});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>)

    const firstNameInput = screen.getByLabelText(/first Name*/i);
    userEvent.type(firstNameInput, "12345");

    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "all");

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton)  

    const errorMessages= await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>)

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput,"taylor@");

    const emailError = await screen.findByText(/email must be a valid email address/i);
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>)

    const firstNameInput = screen.getByLabelText(/first Name*/i);
    userEvent.type(firstNameInput, "12345");

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput,"taylor@gmail.com");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton)

    const lastNameError = await screen.findByText(/lastName is a required field/i);
    expect(lastNameError).toBeInTheDocument();

});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)

    const dummyVariables = ["firstname", "lastname", "taylor@gmail.com"]

    const firstNameInput = screen.getByLabelText(/first Name*/i);
    userEvent.type(firstNameInput, dummyVariables[0]);

    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, dummyVariables[1])

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, dummyVariables[2]);

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton)

    // const subElement = screen.queryByText(dummyVariables)

    // expect(subElement).toBeInTheDocument();
    await waitFor(()=> {
        const firstnameDisplay = screen.queryByText("firstname");
        const lastnameDisplay = screen.queryByText("lastname");
        const emailDisplay = screen.queryByText("taylor@gmail.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    });

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)

    const dummyVariables = ["firstname", "lastname", "taylor@gmail.com", "this is a message"]

    const firstNameInput = screen.getByLabelText(/first Name*/i);
    userEvent.type(firstNameInput, dummyVariables[0]);

    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, dummyVariables[1])

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, dummyVariables[2]);
    
    const messageInput = screen.getByLabelText(/message/i);
    userEvent.type(messageInput, dummyVariables[3]);


    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton)

    // const subElement = screen.queryByText(dummyVariables)

    // expect(subElement).toBeInTheDocument();
    await waitFor(()=> {
        const firstnameDisplay = screen.queryByText("firstname");
        const lastnameDisplay = screen.queryByText("lastname");
        const emailDisplay = screen.queryByText("taylor@gmail.com");
        const messageDisplay = screen.queryByText("this is a message");

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    });

});
