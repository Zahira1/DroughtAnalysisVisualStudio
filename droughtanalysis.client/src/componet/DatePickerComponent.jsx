import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth, isMonday, subDays, startOfWeek } from 'date-fns';
import { range } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import './Css/MapComponent.css'
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import "./Css/MapComponent.css";

function DatePickerComponent({ onChange }) {
    // Calculate the last Monday
    const getLastMonday = () => {
        const today = new Date();
        const lastMonday = startOfWeek(today, { weekStartsOn: 1 });
        return lastMonday;
    };

    // Initialize state with the last Monday
    const [selectedDate, setSelectedDate] = useState(getLastMonday);

    const years = range(2000, getYear(new Date()) + 1, 1);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const filterMondays = (date) => {
        return isMonday(date);
    };

    const onDatePickerChange = (date) => {
        setSelectedDate(date);
        onChange(date);
        console.log('Selected Date:', date);
    };

    useEffect(() => {
        onChange(selectedDate); // Trigger onChange on mount
    }, [selectedDate, onChange]);

    return (
        <div className='datepicker-section' style={{
            backgroundcolor:"#333333"
        } }>
            <DatePicker
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <div
                        style={{
                            margin: 10,
                            display: "flex",
                            
                            backgroundColor: "#333333"
                        }}
                    >
                        <Button variant='dark' className='Date-ele' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                            {<calcite-icon icon="caret-left" />}
                        </Button>
                        <select className='Date-ele'
                            value={getYear(date)}
                            onChange={({ target: { value } }) => changeYear(value)}
                        >
                            {years.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select className='Date-ele'
                            value={months[getMonth(date)]}
                            onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                            }
                        >
                            {months.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <Button variant='dark' className='Date-ele' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                            {<calcite-icon icon="caret-right" />}
                        </Button>
                    </div>
                )}
                selected={selectedDate}
                onChange={(date) => onDatePickerChange(date)}
                filterDate={filterMondays}
            />
        </div>
    );
}

DatePickerComponent.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default DatePickerComponent;
