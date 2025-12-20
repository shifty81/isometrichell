/*
 * GLAD OpenGL Loader Implementation
 */

#include <glad/glad.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>
static HMODULE libgl;
static void open_gl(void) {
    libgl = LoadLibraryA("opengl32.dll");
}
static void close_gl(void) {
    FreeLibrary(libgl);
}
static void *get_proc(const char *namez) {
    void *p = (void *)wglGetProcAddress(namez);
    if(p == 0 || (p == (void*)0x1) || (p == (void*)0x2) || (p == (void*)0x3) || (p == (void*)-1)) {
        p = (void *)GetProcAddress(libgl, namez);
    }
    return p;
}
#else
#include <dlfcn.h>
static void *libgl;
static void open_gl(void) {
#ifdef __APPLE__
    libgl = dlopen("/System/Library/Frameworks/OpenGL.framework/OpenGL", RTLD_LAZY | RTLD_LOCAL);
#else
    libgl = dlopen("libGL.so.1", RTLD_LAZY | RTLD_LOCAL);
#endif
}
static void close_gl(void) {
    dlclose(libgl);
}
static void *get_proc(const char *namez) {
    return dlsym(libgl, namez);
}
#endif

struct gladGLversionStruct GLVersion;

PFNGLCLEARPROC glClear;
PFNGLCLEARCOLORPROC glClearColor;
PFNGLVIEWPORTPROC glViewport;
PFNGLENABLEPROC glEnable;
PFNGLDISABLEPROC glDisable;
PFNGLBLENDFUNCPROC glBlendFunc;
PFNGLDEPTHFUNCPROC glDepthFunc;
PFNGLACTIVETEXTUREPROC glActiveTexture;
PFNGLGETFLOATVPROC glGetFloatv;
PFNGLTEXPARAMETERFPROC glTexParameterf;
PFNGLCULLFACEPROC glCullFace;
PFNGLFRONTFACEPROC glFrontFace;
PFNGLGENTEXTURESPROC glGenTextures;
PFNGLDELETETEXTURESPROC glDeleteTextures;
PFNGLBINDTEXTUREPROC glBindTexture;
PFNGLTEXPARAMETERIPROC glTexParameteri;
PFNGLTEXIMAGE2DPROC glTexImage2D;
PFNGLGENERATEMIPMAPPROC glGenerateMipmap;
PFNGLCREATESHADERPROC glCreateShader;
PFNGLSHADERSOURCEPROC glShaderSource;
PFNGLCOMPILESHADERPROC glCompileShader;
PFNGLGETSHADERIVPROC glGetShaderiv;
PFNGLGETSHADERINFOLOGPROC glGetShaderInfoLog;
PFNGLDELETESHADERPROC glDeleteShader;
PFNGLCREATEPROGRAMPROC glCreateProgram;
PFNGLATTACHSHADERPROC glAttachShader;
PFNGLLINKPROGRAMPROC glLinkProgram;
PFNGLGETPROGRAMIVPROC glGetProgramiv;
PFNGLGETPROGRAMINFOLOGPROC glGetProgramInfoLog;
PFNGLDELETEPROGRAMPROC glDeleteProgram;
PFNGLUSEPROGRAMPROC glUseProgram;
PFNGLGETUNIFORMLOCATIONPROC glGetUniformLocation;
PFNGLUNIFORM1IPROC glUniform1i;
PFNGLUNIFORM1FPROC glUniform1f;
PFNGLUNIFORM2FPROC glUniform2f;
PFNGLUNIFORM3FPROC glUniform3f;
PFNGLUNIFORM4FPROC glUniform4f;
PFNGLUNIFORMMATRIX4FVPROC glUniformMatrix4fv;
PFNGLGENVERTEXARRAYSPROC glGenVertexArrays;
PFNGLDELETEVERTEXARRAYSPROC glDeleteVertexArrays;
PFNGLBINDVERTEXARRAYPROC glBindVertexArray;
PFNGLGENBUFFERSPROC glGenBuffers;
PFNGLDELETEBUFFERSPROC glDeleteBuffers;
PFNGLBINDBUFFERPROC glBindBuffer;
PFNGLBUFFERDATAPROC glBufferData;
PFNGLBUFFERSUBDATAPROC glBufferSubData;
PFNGLENABLEVERTEXATTRIBARRAYPROC glEnableVertexAttribArray;
PFNGLVERTEXATTRIBPOINTERPROC glVertexAttribPointer;
PFNGLDRAWARRAYSPROC glDrawArrays;
PFNGLDRAWELEMENTSPROC glDrawElements;
PFNGLGETSTRINGPROC glGetString;

static void load_GL_VERSION_1_0(GLADloadproc load) {
    glClear = (PFNGLCLEARPROC)load("glClear");
    glClearColor = (PFNGLCLEARCOLORPROC)load("glClearColor");
    glViewport = (PFNGLVIEWPORTPROC)load("glViewport");
    glEnable = (PFNGLENABLEPROC)load("glEnable");
    glDisable = (PFNGLDISABLEPROC)load("glDisable");
    glBlendFunc = (PFNGLBLENDFUNCPROC)load("glBlendFunc");
    glDepthFunc = (PFNGLDEPTHFUNCPROC)load("glDepthFunc");
    glGetString = (PFNGLGETSTRINGPROC)load("glGetString");
    glCullFace = (PFNGLCULLFACEPROC)load("glCullFace");
    glFrontFace = (PFNGLFRONTFACEPROC)load("glFrontFace");
}

static void load_GL_VERSION_1_1(GLADloadproc load) {
    glGenTextures = (PFNGLGENTEXTURESPROC)load("glGenTextures");
    glDeleteTextures = (PFNGLDELETETEXTURESPROC)load("glDeleteTextures");
    glBindTexture = (PFNGLBINDTEXTUREPROC)load("glBindTexture");
    glTexParameteri = (PFNGLTEXPARAMETERIPROC)load("glTexParameteri");
    glTexParameterf = (PFNGLTEXPARAMETERFPROC)load("glTexParameterf");
    glTexImage2D = (PFNGLTEXIMAGE2DPROC)load("glTexImage2D");
    glDrawArrays = (PFNGLDRAWARRAYSPROC)load("glDrawArrays");
    glDrawElements = (PFNGLDRAWELEMENTSPROC)load("glDrawElements");
    glGetFloatv = (PFNGLGETFLOATVPROC)load("glGetFloatv");
}

static void load_GL_VERSION_1_5(GLADloadproc load) {
    glGenBuffers = (PFNGLGENBUFFERSPROC)load("glGenBuffers");
    glDeleteBuffers = (PFNGLDELETEBUFFERSPROC)load("glDeleteBuffers");
    glBindBuffer = (PFNGLBINDBUFFERPROC)load("glBindBuffer");
    glBufferData = (PFNGLBUFFERDATAPROC)load("glBufferData");
    glBufferSubData = (PFNGLBUFFERSUBDATAPROC)load("glBufferSubData");
}

static void load_GL_VERSION_2_0(GLADloadproc load) {
    glCreateShader = (PFNGLCREATESHADERPROC)load("glCreateShader");
    glShaderSource = (PFNGLSHADERSOURCEPROC)load("glShaderSource");
    glCompileShader = (PFNGLCOMPILESHADERPROC)load("glCompileShader");
    glGetShaderiv = (PFNGLGETSHADERIVPROC)load("glGetShaderiv");
    glGetShaderInfoLog = (PFNGLGETSHADERINFOLOGPROC)load("glGetShaderInfoLog");
    glDeleteShader = (PFNGLDELETESHADERPROC)load("glDeleteShader");
    glCreateProgram = (PFNGLCREATEPROGRAMPROC)load("glCreateProgram");
    glAttachShader = (PFNGLATTACHSHADERPROC)load("glAttachShader");
    glLinkProgram = (PFNGLLINKPROGRAMPROC)load("glLinkProgram");
    glGetProgramiv = (PFNGLGETPROGRAMIVPROC)load("glGetProgramiv");
    glGetProgramInfoLog = (PFNGLGETPROGRAMINFOLOGPROC)load("glGetProgramInfoLog");
    glDeleteProgram = (PFNGLDELETEPROGRAMPROC)load("glDeleteProgram");
    glUseProgram = (PFNGLUSEPROGRAMPROC)load("glUseProgram");
    glGetUniformLocation = (PFNGLGETUNIFORMLOCATIONPROC)load("glGetUniformLocation");
    glUniform1i = (PFNGLUNIFORM1IPROC)load("glUniform1i");
    glUniform1f = (PFNGLUNIFORM1FPROC)load("glUniform1f");
    glUniform2f = (PFNGLUNIFORM2FPROC)load("glUniform2f");
    glUniform3f = (PFNGLUNIFORM3FPROC)load("glUniform3f");
    glUniform4f = (PFNGLUNIFORM4FPROC)load("glUniform4f");
    glUniformMatrix4fv = (PFNGLUNIFORMMATRIX4FVPROC)load("glUniformMatrix4fv");
    glEnableVertexAttribArray = (PFNGLENABLEVERTEXATTRIBARRAYPROC)load("glEnableVertexAttribArray");
    glVertexAttribPointer = (PFNGLVERTEXATTRIBPOINTERPROC)load("glVertexAttribPointer");
}

static void load_GL_VERSION_3_0(GLADloadproc load) {
    glGenVertexArrays = (PFNGLGENVERTEXARRAYSPROC)load("glGenVertexArrays");
    glDeleteVertexArrays = (PFNGLDELETEVERTEXARRAYSPROC)load("glDeleteVertexArrays");
    glBindVertexArray = (PFNGLBINDVERTEXARRAYPROC)load("glBindVertexArray");
    glGenerateMipmap = (PFNGLGENERATEMIPMAPPROC)load("glGenerateMipmap");
    glActiveTexture = (PFNGLACTIVETEXTUREPROC)load("glActiveTexture");
}

static void* glad_get_proc_from_userptr(void* userptr, const char *name) {
    return ((GLADloadproc)userptr)(name);
}

int gladLoadGLLoader(GLADloadproc load) {
    if(load == NULL) {
        return 0;
    }
    
    GLVersion.major = 3;
    GLVersion.minor = 3;
    
    load_GL_VERSION_1_0(load);
    load_GL_VERSION_1_1(load);
    load_GL_VERSION_1_5(load);
    load_GL_VERSION_2_0(load);
    load_GL_VERSION_3_0(load);
    
    return GLVersion.major != 0 || GLVersion.minor != 0;
}

int gladLoadGL(void) {
    int status = 0;
    open_gl();
    if(libgl != NULL) {
        status = gladLoadGLLoader(&get_proc);
        close_gl();
    }
    return status;
}
