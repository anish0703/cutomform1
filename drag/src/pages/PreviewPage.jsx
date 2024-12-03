
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const [formTitle, setFormTitle] = useState(""); 
  const [formElements, setFormElements] = useState([]);
  const [passwordError, setPasswordError] = useState(""); 
  const [formSubmitted, setFormSubmitted] = useState(false); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const storedFormElements = JSON.parse(localStorage.getItem("formElements"));
    const storedFormTitle = localStorage.getItem("formTitle"); 
    if (storedFormElements) {
      setFormElements(storedFormElements);
    }
    if (storedFormTitle) {
      setFormTitle(storedFormTitle); 
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    
    const passwordField = data.Password;
    const minPasswordLength = 6;
    const maxPasswordLength = 12;

    if (passwordField && passwordField.length < minPasswordLength) {
      setPasswordError(`Password must be at least ${minPasswordLength} characters.`);
      return; 
    } else if (passwordField && passwordField.length > maxPasswordLength) {
      setPasswordError(`Password cannot exceed ${maxPasswordLength} characters.`);
      return; 
    }
    setPasswordError("");

    
    const submittedData = {
      title: formTitle,
      formData: data,
    };
    localStorage.setItem("submittedFormData", JSON.stringify(submittedData));

    
    setFormSubmitted(true);

    
    setTimeout(() => {
      alert("Form submitted successfully!"); 
      navigate("/form-builder"); 
    }, 1000); 
  };

  const handleDelete = () => {
    
    localStorage.removeItem("formElements");
    localStorage.removeItem("formTitle"); 
    localStorage.removeItem("submittedFormData"); 

    
    navigate("/form-builder");
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const minPasswordLength = 6;
    const maxPasswordLength = 12;

    
    if (password.length < minPasswordLength) {
      setPasswordError(`Password must be at least ${minPasswordLength} characters.`);
    } else if (password.length > maxPasswordLength) {
      setPasswordError(`Password cannot exceed ${maxPasswordLength} characters.`);
    } else {
      setPasswordError(""); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
      <div className="w-4/5 max-w-3xl bg-white shadow-lg rounded-lg p-8">
        
        {formTitle && (
          <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
            {formTitle}
          </h1>
        )}
        {formSubmitted && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
            Form submitted successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formElements.map((element, index) => (
            <div key={index} className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                {element.label}
              </label>
              {element.type === "text" && (
                <input
                  type="text"
                  name={element.label}
                  placeholder={element.placeholder}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                  required
                />
              )}
              {element.type === "email" && (
                <input
                  type="email"
                  name={element.label}
                  placeholder={element.placeholder}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                  required
                />
              )}
              {element.type === "number" && (
                <input
                  type="number"
                  name={element.label}
                  placeholder={element.placeholder}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                  required
                />
              )}
              {element.type === "checkbox" && (
                <input
                  type="checkbox"
                  name={element.label}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              )}
              {element.type === "radio" && (
                <input
                  type="radio"
                  name={element.label}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              )}
              {element.type === "dropdown" && (
                <select
                  name={element.label}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                >
                  {element.options?.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {element.type === "tel" && (
                <input
                  type="tel"
                  name={element.label}
                  placeholder={element.placeholder}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                  required
                />
              )}
              {element.type === "password" && (
                <div>
                  <input
                    type="password"
                    name="Password" 
                    placeholder={element.placeholder}
                    className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                    required
                    maxLength={12} 
                    onChange={handlePasswordChange} 
                  />
                  
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                  )}
                </div>
              )}
              {element.type === "file" && (
                <input
                  type="file"
                  name={element.label}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                />
              )}
              {element.type === "date" && (
                <input
                  type="date"
                  name={element.label}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                  required
                />
              )}
              {element.type === "range" && (
                <input
                  type="range"
                  name={element.label}
                  min={element.min || 0}
                  max={element.max || 100}
                  step={element.step || 1}
                  className="w-full"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </form>

        
        <button
          onClick={handleDelete}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:ring focus:ring-red-300"
        >
          Delete Form
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
