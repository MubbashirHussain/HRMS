import React from 'react';
import { Calendar } from "@heroui/react";

export default function Calender() {
    return (
        <div className="flex gap-x-4">
            <Calendar aria-label="Date (No Selection)" />
            <Calendar aria-label="Date (Uncontrolled)" />
        </div>
    );
}
