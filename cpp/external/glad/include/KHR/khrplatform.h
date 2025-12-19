/*
 * KHR Platform Header
 */

#ifndef __khrplatform_h_
#define __khrplatform_h_

/*
** Copyright (c) 2008-2018 The Khronos Group Inc.
**
** Permission is hereby granted, free of charge, to any person obtaining a
** copy of this software and/or associated documentation files (the
** "Materials"), to deal in the Materials without restriction, including
** without limitation the rights to use, copy, modify, merge, publish,
** distribute, sublicense, and/or sell copies of the Materials, and to
** permit persons to whom the Materials are furnished to do so, subject to
** the following conditions:
**
** The above copyright notice and this permission notice shall be included
** in all copies or substantial portions of the Materials.
**
** THE MATERIALS ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
** EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
** MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
** IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
** CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
** TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
** MATERIALS OR THE USE OR OTHER DEALINGS IN THE MATERIALS.
*/

/* Platform-specific types and definitions for OpenGL ES 2.0  and greater
 *
 * This relies on platform-specific headers to define the following
 * platform-specific types and macros:
 *
 * Macros:
 *    KHRONOS_APICALL
 *    KHRONOS_APIENTRY
 *    KHRONOS_APIATTRIBUTES
 *
 * Types:
 *    khronos_int8_t            signed   8  bit integer
 *    khronos_uint8_t           unsigned 8  bit integer
 *    khronos_int16_t           signed   16 bit integer
 *    khronos_uint16_t          unsigned 16 bit integer
 *    khronos_int32_t           signed   32 bit integer
 *    khronos_uint32_t          unsigned 32 bit integer
 *    khronos_int64_t           signed   64 bit integer
 *    khronos_uint64_t          unsigned 64 bit integer
 *    khronos_intptr_t          signed   same number of bits as a pointer
 *    khronos_uintptr_t         unsigned same number of bits as a pointer
 *    khronos_ssize_t           signed   size
 *    khronos_usize_t           unsigned size
 *    khronos_float_t           signed   32 bit floating point
 *    khronos_time_ns_t         unsigned 64 bit time in nanoseconds
 *    khronos_utime_nanoseconds_t  unsigned time interval or absolute time in
 *                                 nanoseconds
 *    khronos_stime_nanoseconds_t  signed time interval in nanoseconds
 *    khronos_boolean_enum_t    enumerated boolean type
 */

#include <stdint.h>

typedef int8_t    khronos_int8_t;
typedef uint8_t   khronos_uint8_t;
typedef int16_t   khronos_int16_t;
typedef uint16_t  khronos_uint16_t;
typedef int32_t   khronos_int32_t;
typedef uint32_t  khronos_uint32_t;
typedef int64_t   khronos_int64_t;
typedef uint64_t  khronos_uint64_t;
typedef intptr_t  khronos_intptr_t;
typedef uintptr_t khronos_uintptr_t;
typedef signed long khronos_ssize_t;
typedef unsigned long khronos_usize_t;
typedef float khronos_float_t;
typedef khronos_uint64_t khronos_time_ns_t;
typedef khronos_uint64_t khronos_utime_nanoseconds_t;
typedef khronos_int64_t khronos_stime_nanoseconds_t;

#define KHRONOS_SUPPORT_INT64   1
#define KHRONOS_SUPPORT_FLOAT   1

#ifndef KHRONOS_APICALL
#   define KHRONOS_APICALL
#endif

#ifndef KHRONOS_APIENTRY
#   define KHRONOS_APIENTRY
#endif

#ifndef KHRONOS_APIATTRIBUTES
#   define KHRONOS_APIATTRIBUTES
#endif

typedef enum {
    KHRONOS_FALSE = 0,
    KHRONOS_TRUE  = 1,
    KHRONOS_BOOLEAN_ENUM_FORCE_SIZE = 0x7FFFFFFF
} khronos_boolean_enum_t;

#endif /* __khrplatform_h_ */
