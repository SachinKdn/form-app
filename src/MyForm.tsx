import React, { useEffect } from "react";
import { useForm , useFieldArray} from "react-hook-form";
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface IFormInput {
    name: string;
    email: string;
    phone: number;
    age: number;
    pinCode: string;
    // arr: string[];
    arr?: { value: string }[];
  }

//yup schema creation

const inputSchema = yup.object().shape({
    name: yup.string().required("Name is a required field."),
    email: yup.string().required("Email is a required field."),
    phone: yup.number().required("Phone is a required field."),
    age: yup.number()
    .typeError('Age must be a number')
    .required("Please provide your age.")
    .min(18, "Too little")
    .max(60, 'Very Old!'),
    pinCode: yup
    .string()
    .required("Zipcode is a required field"),
    // .matches(/^\d{5}(?:[-\s]\d{4})?$/, "Invalid zipcode format"),
    // arr: yup.array()
    arr: yup.array().of(
        yup.object().shape({
          value: yup.string().required("This field is required"),
        })
      ),
  })


const MyForm: React.FC = () => {
  
  
  const {
    register, //(method) it handle all the input fields and connect input element to the form state
    handleSubmit, //(method) it will take the callback method of onSubmit to handle the submission of form, it take the callback func after the form validation ----> "This method ensures that the form data is only passed to your callback if all validations are satisfied."
    setValue, //to set the initial values, we have their this method --> "You have the pass the key, value into this method through useEffect to show the intial value after the UI rendering"
    formState: {errors},
    watch, //Monitor specific form fields or the entire form for changes.
    reset, //reset(); --> inside the onSubmit // Reset form to default values
    control
  } = useForm<IFormInput>({resolver: yupResolver(inputSchema)});
  const { fields, append, remove } = useFieldArray({
    control,
    name: "arr", // Correct name of the field array
  });
  const watchField = watch('email'); // Monitor 'example' field
  const onSubmit = (data: IFormInput) => {
    console.log(data);
    reset();
    toast.success('🦄 Wow so easy!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
        });
    // toast("Wow so easy!")
  };

  useEffect(()=>{
    setValue("name","Sachu")
    console.log(errors)
  },[setValue,errors])

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="">Your Name</label>
          <input type="text" {...register("name", { required: true })} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="">Your Email</label>
          <input type="text" {...register("email", { required: true })} />
          {watchField === 'show' && <p>You typed 'show'</p>}
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className="input-field">
          <label>Phone</label>
          <input type="tel" {...register("phone")} />
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>
        <div className="input-field">
          <label>Age</label>
          <input type="number" {...register("age")} />
          {errors.age && <p>{errors.age.message}</p>}
        </div>
        <div className="input-field">
          <label>Pin Code</label>
          <input {...register("pinCode")} />
          {errors.pinCode && <p>{errors.pinCode.message}</p>}
        </div>

        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              {...register(`arr.${index}.value`)}
              placeholder="Arr Value"
            />
            {errors.arr?.[index]?.value && (
              <p>{errors.arr[index]?.value?.message}</p>
            )}
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append({ value: "" })}>
          Add Item
        </button>


        <input type="submit" />
      </form>
    </div>
  );
};

export default MyForm;
