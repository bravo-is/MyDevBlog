---
title: "The Implicit Move Footgun: Dangling Pointers in C++"
pubDate: 2026-02-24
description: "How implicit moves copy raw pointers instead of transferring ownership, creating dangling pointer bugs."
author: "Israel Bravo"
image:
    url: "/images/posts/cpp-move-footgun.webp"
    alt: "Diagram showing implicit move performing a shallow pointer copy"
tags: ["cpp", "memory-management", "move-semantics"]
---

When you don't define explicit move semantics, the compiler generates a default move constructor that performs memberwise moves. For types like `std::unique_ptr` or `std::string`, this works correctly because they properly transfer ownership.

But raw pointers -*and other integral types*- are different. When the compiler performs a memberwise move of a raw pointer, it just copies the pointer value. There's no special ownership transfer semantics, both the source and destination end up owning the same resource.

## The Silent Shallow Copy

```cpp
struct Handle 
{ 
    int id{123};
};

class Connection 
{
private:
    Handle* m_handle{nullptr};

public:
    Connection() 
    { 
        m_handle = new Handle{}; 
    }
    ~Connection() 
    { 
        delete m_handle; 
    }
    
    // Compiler generates (implicitly):
    Connection(Connection&& other) noexcept
    : m_handle(other.m_handle)    // ← Copies the pointer value
    {
        // Without explicit move semantics, this default just copies the pointer.
        // Both objects now think they own m_handle.
    }
};


```

Now two objects think they own the same resource. When the source object is destroyed, it deletes the memory. The destination object now holds a dangling pointer.

```cpp
auto c1 = Connection{};
auto c2 = Connection{std::move(c1)};  // Shallow copy, not a move
// c1.m_handle and c2.m_handle point to the same Handle

c1.~Connection();  // Calls delete on m_handle
// Now c2.m_handle is a dangling pointer

// Accessing c2.m_handle now is undefined behavior
// c2.~Connection() will delete already-freed memory
```

## The Fix

```cpp
struct Handle 
{ 
    int id{123}; 
};

class Connection 
{
public:
    Connection() 
    { 
        m_handle = new Handle{}; 
    }
    ~Connection() 
    { 
        delete m_handle;
    }
    
    // Explicit move: transfer ownership
    Connection(Connection&& other) noexcept
        : m_handle{other.m_handle} 
    {
        other.m_handle = nullptr;  // Clear the source—it no longer owns the resource
    }
    
    Connection& operator=(Connection&& other) noexcept 
    {
        if (this != &other) 
        {
            delete m_handle;
            m_handle = other.m_handle;
            other.m_handle = nullptr;
        }
        return *this;
    }
    
    Connection(const Connection&) = delete;
    Connection& operator=(const Connection&) = delete;
    
private:
    Handle* m_handle{nullptr};
};
```

By nullifying the source's pointer after the move, we ensure only one object owns the resource at any time.

## Why This Matters

Memberwise copying works fine for integral types (`int`, `float`, `size_t`)—they're value types. But for pointers, a copy merely duplicates the address, not the ownership semantics. Without explicit moves that clear the source, you get multiple owners pointing to the same resource, leading to double-deletes or use-after-free bugs.

For other types like `std::string`, `std::vector`, or `std::unique_ptr`, default move semantics work correctly because those types have proper move constructors that transfer ownership. But raw pointers have no such semantics—they're just addresses.

```cpp
// This would NOT have the problem:
class SafeConnection 
{
private:
    std::unique_ptr<Handle> m_handle{};  // Smart pointer with move semantics
};

auto c1 = SafeConnection{};
auto c2 = SafeConnection{std::move(c1)};  // Proper move—c1.m_handle is now nullptr
```

The issue only exists with raw pointers because they lack built-in ownership transfer semantics.

## The Rule

**Never rely on implicit move semantics for pointer-owning classes.** Always define explicit move operations that transfer ownership by clearing the source. Alternatively, use move-only smart pointers (`unique_ptr`) to enforce correctness at compile time.
