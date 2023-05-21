import React from 'react';
import { useField, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '@/components/_functions/common-functions';
import { date } from 'yup';

export const CustomTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error-message">{meta.error}</div>
      ) : (
        ''
      )}
    </>
  );
};

export const CustomTextArea = (props) => {
  const { label, name, ...rest } = props;
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <Field as="textarea" id={name} name={name} {...rest} />
      <ErrorMessage name={name} />
    </>
  );
};

export const CustomCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <>
      <label className="checkbox">
        <input {...field} {...props} type="checkbox" />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error-message">{meta.error}</div>
      ) : (
        <div className="error-message">&nbsp;</div>
      )}
    </>
  );
};

export const CustomSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error-message">{meta.error}</div>
      ) : (
        <div className="error-message">&nbsp;</div>
      )}
    </>
  );
};

export const FormDatePicker = ({ label, name, dateDistance, ...props }) => {
  const filteredDay = (date, referenceDate) => {
    return date >= referenceDate.setHours(0, 0, 0, 0);
  };

  const toDay = new Date();
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <Field name={name}>
        {({ field, meta, form: { setFieldValue, handleBlur } }) => {
          return (
            <>
              <DatePicker
                {...field}
                selected={field.value || null}
                onChange={(val) => {
                  setFieldValue(field.name, val, true);
                }}
                onBlur={handleBlur(field.name)}
                placeholderText={formatDate(
                  new Date().setDate(toDay.getDate() + dateDistance)
                )}
                filterDate={(date) => filteredDay(date, toDay)}
                timezone="Asia/Dhaka"
              />
              {meta.touched && meta.error ? (
                <div className="error-message">{meta.error}</div>
              ) : (
                <div className="error-message">&nbsp;</div>
              )}
            </>
          );
        }}
      </Field>
    </>
  );
};
