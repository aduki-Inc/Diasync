# **Prompting Guide for Diasync Health Platform Development**

This document outlines the prompting patterns, rules, and methodologies established during the development of the Diasync health platform. Use these guidelines to maintain consistency across all AI-assisted development sessions.

---

## 1. Core Prompting Principles

### 1.1 Progressive Development Approach

- **Start with Analysis**: Always begin with "study the design and architecture of my code"
- **Incremental Enhancement**: Build features step-by-step rather than massive overhauls
- **Documentation Sync**: Regularly update documentation to match implemented features

### 1.2 Context-First Methodology

- **Understand Before Acting**: AI must gather sufficient context before making changes
- **Read Existing Code**: Analyze current implementation patterns before adding new features
- **Maintain Consistency**: Follow established architectural patterns and naming conventions

---

## 2. Navigation & Architecture Rules

### 2.1 Navigation Structure Standards

- **Single-Word Sub-Navigation**: All sub-navigation items use single words (e.g., "Add" not "Add New")
- **Health-Focused Categorization**: Organize features around health services (Bookings, Providers, Pharmacy, etc.)
- **Consistent Hierarchy**: Maintain 14-section main navigation with clearly defined sub-items
- **Mobile-Optimized**: Design navigation for mobile-first responsive experience

### 2.2 Technical Implementation Patterns

- **Shadow DOM Architecture**: Use web components with Shadow DOM encapsulation
- **Comprehensive Routing**: Implement complete routing system for all navigation paths
- **Component-Based Structure**: Follow modular component architecture
- **Health Platform Context**: Maintain Diaspora-to-Kenya health services focus

---

## 3. Feature Development Workflow

### 3.1 Feature Addition Process

1. **Analyze Current Structure**: Study existing navigation and component patterns
2. **Identify Integration Points**: Determine where new features fit in current architecture
3. **Follow Naming Conventions**: Use established single-word pattern for consistency
4. **Implement Incrementally**: Add features in logical, testable increments
5. **Update Documentation**: Sync documentation with implemented changes

### 3.2 Code Enhancement Rules

- **Preserve Existing Functionality**: Never break working features when adding new ones
- **Maintain Pattern Consistency**: Follow established coding patterns and component structure
- **Health Services Focus**: Keep all enhancements aligned with health platform objectives
- **User Experience Priority**: Prioritize intuitive navigation and clear health service categorization

---

## 4. Communication Patterns

### 4.1 Effective Prompt Structure

- **Clear Intent**: State exact goals (e.g., "add meetings tab for video calls")
- **Context Reference**: Reference existing documentation and code structure
- **Specific Requirements**: Provide detailed specifications for new features
- **Consistency Emphasis**: Request adherence to established patterns

### 4.2 Documentation Update Requests

- **Match Implementation**: "update ui.md to match the pages" - sync docs with actual code
- **Comprehensive Coverage**: Document all navigation sections and sub-items
- **Technical Context**: Include implementation notes and architectural decisions
- **User-Focused Language**: Write documentation for both developers and stakeholders

---

## 5. Quality Assurance Guidelines

### 5.1 Code Quality Standards

- **Component Integrity**: Ensure all components follow Shadow DOM patterns
- **Navigation Completeness**: Verify all navigation items have corresponding routes
- **Mobile Responsiveness**: Test navigation on mobile devices
- **Health Platform Alignment**: Confirm features serve health services objectives

### 5.2 Documentation Standards

- **Accuracy**: Documentation must reflect actual implemented features
- **Completeness**: Cover all navigation sections and functionality
- **Clarity**: Write for both technical and non-technical audiences
- **Maintainability**: Structure documentation for easy updates

---

## 6. Platform-Specific Context

### 6.1 Diasync Health Platform Focus

- **Target Audience**: Kenyan diaspora accessing health services
- **Service Categories**: Bookings, Video Consultations, Pharmacy, Ambulance, Dependents
- **User Experience**: Family-centered health management approach
- **Technical Architecture**: Shadow DOM web components with comprehensive routing

### 6.2 Health Services Integration

- **Video Consultations**: Real-time meeting capabilities with recordings/transcripts
- **Emergency Services**: Ambulance dispatch with real-time tracking
- **Pharmacy Services**: Prescription management and delivery tracking
- **Family Care**: Dependent management with health records
- **Financial Management**: Payment processing and subscription billing

---

## 7. Common Prompt Templates

### 7.1 Architecture Analysis

```
"study the design and architectural of my code"
```

- Use when starting new development sessions
- Helps AI understand current implementation state
- Establishes context for feature additions

### 7.2 Feature Addition

```
"add [specific feature] with [specific requirements]"
```

- Be specific about functionality needed
- Reference existing patterns when applicable
- Emphasize consistency with current architecture

### 7.3 Documentation Sync

```
"study the navs and update [documentation] to match the pages"
```

- Use after implementing new features
- Ensures documentation accuracy
- Maintains project documentation quality

### 7.4 Navigation Enhancement

```
"enhance navigation with [health-specific features] based on [documentation reference]"
```

- Reference existing documentation for context
- Specify health platform requirements
- Maintain established navigation patterns

---

## 8. Best Practices Summary

### 8.1 Development Workflow

1. **Analyze First**: Always start with code architecture analysis
2. **Incremental Progress**: Build features step-by-step
3. **Pattern Consistency**: Follow established architectural patterns
4. **Health Focus**: Maintain diaspora health services context
5. **Document Updates**: Keep documentation synchronized with implementation

### 8.2 Communication Guidelines

- **Be Specific**: Provide clear, detailed requirements
- **Reference Context**: Use existing documentation and code patterns
- **Emphasize Consistency**: Request adherence to established conventions
- **Health Platform Focus**: Maintain service-oriented feature development

### 8.3 Quality Assurance

- **Test Navigation**: Verify all routes work correctly
- **Check Responsiveness**: Ensure mobile optimization
- **Validate Documentation**: Confirm docs match implementation
- **Health Services Alignment**: Verify features serve platform objectives

---

## 9. Troubleshooting Common Issues

### 9.1 Navigation Problems

- **Missing Routes**: Ensure all navigation items have corresponding route handlers
- **Inconsistent Naming**: Verify single-word sub-navigation pattern
- **Mobile Issues**: Check responsive design implementation

### 9.2 Documentation Misalignment

- **Outdated Information**: Regular sync docs with actual implementation
- **Missing Features**: Document all implemented navigation sections
- **Technical Gaps**: Include implementation notes and architectural context

### 9.3 Feature Integration Issues

- **Pattern Violations**: Ensure new features follow established conventions
- **Health Platform Misalignment**: Verify features serve health services objectives
- **Component Inconsistency**: Maintain Shadow DOM architecture patterns

---

## 10. Success Metrics

### 10.1 Development Quality

- ✅ All navigation items functional with proper routing
- ✅ Consistent single-word sub-navigation pattern
- ✅ Mobile-responsive design implementation
- ✅ Health services-focused feature organization

### 10.2 Documentation Quality

- ✅ Accurate reflection of implemented features
- ✅ Comprehensive coverage of all platform sections
- ✅ Clear technical implementation notes
- ✅ User-friendly language and structure

### 10.3 Platform Alignment

- ✅ Diaspora-to-Kenya health services focus maintained
- ✅ Family-centered health management approach
- ✅ Real-time service tracking capabilities
- ✅ Comprehensive health service integration

---

This prompting guide ensures consistent, high-quality AI-assisted development for the Diasync health platform. Use these patterns and rules to maintain architectural integrity and deliver effective health services technology.
