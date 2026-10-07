#include <stdio.h>

float addition(float a, float b)
{
    return a + b;
}

float subtraction(float a, float b)
{
    return a - b;
}

float multiplication(float a, float b)
{
    return a * b;
}

float division(float a, float b)
{
    return a / b;
}

int main()
{
    float a, b, result;
    int choice;

    printf("Simple Calculator\n");
    printf("-----------------\n");

    printf("Enter first number: ");
    scanf("%f", &a);

    printf("Enter second number: ");
    scanf("%f", &b);

    printf("\n1. Addition");
    printf("\n2. Subtraction");
    printf("\n3. Multiplication");
    printf("\n4. Division");

    printf("\n\nEnter your choice: ");
    scanf("%d", &choice);

    switch (choice)
    {
        case 1:
            result = addition(a, b);
            printf("Addition = %.2f", result);
            break;

        case 2:
            result = subtraction(a, b);
            printf("Subtraction = %.2f", result);
            break;

        case 3:
            result = multiplication(a, b);
            printf("Multiplication = %.2f", result);
            break;

        case 4:
            if (b != 0)
            {
                result = division(a, b);
                printf("Division = %.2f", result);
            }
            else
            {
                printf("Division by zero is not possible.");
            }
            break;

        default:
            printf("Invalid choice.");
    }

    return 0;
}
