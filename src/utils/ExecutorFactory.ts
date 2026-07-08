import type CodeExecutorStrategy from "../containers/codeExecutorStrategy.js";
import PythonExecutor from "../containers/PythonExecutor.js";
import CppExecutor from "../containers/CppExevutor.js";
import JavaExecutor from "../containers/JavaExecutor.js";

export default function createExecutor(codeLanguage: string) : CodeExecutorStrategy | null {
    if(codeLanguage.toLowerCase() === "python"){
        return new PythonExecutor();
    } else if (codeLanguage.toLowerCase() === "java"){
        return new JavaExecutor();
    } else if (codeLanguage.toLowerCase() === "cpp"){
        return new CppExecutor();
    } else {return null; }
    
}