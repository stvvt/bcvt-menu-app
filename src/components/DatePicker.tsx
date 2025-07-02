import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from 'react-datepicker';
import { type ComponentProps, type FC } from 'react';

type DatePickerProps = ComponentProps<typeof ReactDatePicker>;

const DatePicker: FC<DatePickerProps> = (props) => {
  return (
    <ReactDatePicker 
      {...props} 
      popperContainer={({children}) => 
        <div style={{ position: 'fixed', zIndex: 9999 }}>{children}</div>
      }
    />
  );
};

export default DatePicker;
