import numpy as np
import math
from scipy import linalg
import scikits.bvp_solver
import matplotlib.pyplot as plt

def dzdx(x,z):
    #Return array containing RHS of ODEs
    return np.array([ z[1], -np.abs(z[0])])

def bc_fun(za,zb):
    #Return a tuple containing 2 arrays - left and right side BC residuals
    #Note: len(left BCs) + len(right BCs) = num of ODEs
    return (np.array([za[0]]), np.array([zb[0]+2]))

# Define Problem
problem = scikits.bvp_solver.ProblemDefinition(num_ODE=2, #Number of ODes
                                            num_parameters = 0, #Number of parameters
                                            num_left_boundary_conditions = 1, #Number of left BCs
                                            boundary_points = (0,4), #Boundary points of independent coordinate
                                            function = dzdx, #ODE function
                                            boundary_conditions = bc_fun) #BC function

#Defne initial guess as a tuple (constant solution)
guess = (1.0, 0.0)

#Solve  - returns a solution structure
soln = scikits.bvp_solver.solve(problem, solution_guess = guess)

#Evaluate solution at choice of grid
x_grid = np.linspace(0,4,100)
z = soln(x_grid) #solution components arranged row-wise

# Plot

plt.figure()
plt.plot(x_grid,z[0,:],'b-',linewidth=2)
plt.plot(x_grid,z[1,:],'r-',linewidth=2)
plt.grid('on')
plt.xlabel('X'); plt.ylabel('Z')
plt.legend(['Z_1','Z_2'])

plt.show()
