package com.adotapet.adotapet;

public class ApiResponse<T> {

    private String message;
    private T data;

    //construtor
    public ApiResponse(String message, T data) {
        this.message = message;
        this.data = data;
        }

    public ApiResponse(){}

    public String getMessage() {
        return message;
        }
    
    public void setMessage(String message) {
        this.message = message;
        }
    
    public T getData() {
        return data;
        }
    
    public void setData(T data) {
        this.data = data;
        }
    
    @Override
    public String toString() {
        return "ApiResponse [messgage: " + message + ", data: " + data + "]";
    }
}
