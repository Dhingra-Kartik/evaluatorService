import type CodeExecutorStrategy from "../containers/codeExecutorStrategy.js";
import PythonExecutor from "../containers/PythonExecutor.js";
import CppExecutor from "../containers/CppExevutor.js";
import JavaExecutor from "../containers/JavaExecutor.js";

export default function createExecutor(codeLanguage: string): CodeExecutorStrategy | null {
    if(codeLanguage === "PYTHON"){
        return new PythonExecutor();
    } else if (codeLanguage === "JAVA"){
        return new JavaExecutor();
    } else if (codeLanguage === "CPP"){
        return new CppExecutor();
    } else {return null; }
    
}