import { forwardRef } from "react";

interface BaseProps {
    label?: string;
    type?: "text" | "number" | "password" | "email" | "textarea"
    className?: string;
}

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>

type TextareaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Props = InputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
    ({ label, type = "text", className, ...props }, ref) => {
        return (
            <div className="w-full ">
                {label && (
                    <label className="block font-semibold text-slate-700 mb-1">
                        {label}
                    </label>
                )}
                {type === "textarea" ? (
                    <textarea
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        className={`w-full border outline-none border-slate-200 bg-white p-2 rounded-md text-slate-900 placeholder:text-slate-400 ${className}`}
                        {...(props as TextareaProps)}
                    />
                ) : (
                    <input type={type}
                        ref={ref as React.Ref<HTMLInputElement>}
                        className={`w-full border outline-none border-slate-200 bg-white p-2 rounded-md text-slate-900 placeholder:text-slate-400 ${className}`}
                        {...(props as InputProps)}
                    />
                )}
            </div>
        )
    }
)

Input.displayName = "Input";
export default Input;
