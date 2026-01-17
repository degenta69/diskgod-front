import React, { useEffect, useRef } from 'react';

const FluidBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let animationFrameId;

        // Configuration
        const config = {
            resolution: 20, // Lower = more cells, higher perf cost
            pen_size: 40,
            speck_count: 5000,
            viscosity: 0.99, // Velocity decay
            particle_drag: 0.05,
            colors: ['#00FFFF', '#00CCFF', '#00ff99'] // Cyan/Teal futuristic palette
        };

        // State
        let mouse = { x: 0, y: 0, px: 0, py: 0, down: false };
        let vec_cells = [];
        let particles = [];
        let num_cols, num_rows;

        function initGrid() {
            vec_cells = [];
            for (let col = 0; col < num_cols; col++) {
                vec_cells[col] = [];
                for (let row = 0; row < num_rows; row++) {
                    let cell_data = new Cell(col * config.resolution, row * config.resolution, config.resolution);
                    cell_data.col = col;
                    cell_data.row = row;
                    vec_cells[col][row] = cell_data;
                }
            }

            // Link Neighbors
            for (let col = 0; col < num_cols; col++) {
                for (let row = 0; row < num_rows; row++) {
                    let cell_data = vec_cells[col][row];
                    let row_up = (row - 1 >= 0) ? row - 1 : num_rows - 1;
                    let col_left = (col - 1 >= 0) ? col - 1 : num_cols - 1;
                    let col_right = (col + 1 < num_cols) ? col + 1 : 0;

                    // Diagonal links
                    let up = vec_cells[col][row_up];
                    let left = vec_cells[col_left][row];
                    let up_left = vec_cells[col_left][row_up];
                    let up_right = vec_cells[col_right][row_up];

                    // Set neighbors
                    cell_data.up = up;
                    cell_data.left = left;
                    cell_data.up_left = up_left;
                    cell_data.up_right = up_right;

                    // Reverse links
                    up.down = vec_cells[col][row];
                    left.right = vec_cells[col][row];
                    up_left.down_right = vec_cells[col][row];
                    up_right.down_left = vec_cells[col][row];

                    // Ensure safety for right/down references which are used in update_particle
                    cell_data.right = vec_cells[col_right][row];
                    cell_data.down = (row + 1 < num_rows) ? vec_cells[col][row + 1] : vec_cells[col][0];
                }
            }
        }

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            num_cols = Math.ceil(width / config.resolution);
            num_rows = Math.ceil(height / config.resolution);

            initGrid();
        }

        class Cell {
            constructor(x, y, res) {
                this.x = x;
                this.y = y;
                this.r = res;
                this.col = 0;
                this.row = 0;
                this.xv = 0;
                this.yv = 0;
                this.pressure = 0;
            }
        }

        class Particle {
            constructor(x, y) {
                this.x = this.px = x;
                this.y = this.py = y;
                this.xv = this.yv = 0;
                this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            }

            update() {
                // Determine grid cell
                if (this.x >= 0 && this.x < width && this.y >= 0 && this.y < height) {
                    let col = parseInt(this.x / config.resolution);
                    let row = parseInt(this.y / config.resolution);

                    // Safety check
                    if (!vec_cells[col] || !vec_cells[col][row]) return;

                    let cell_data = vec_cells[col][row];

                    let ax = (this.x % config.resolution) / config.resolution;
                    let ay = (this.y % config.resolution) / config.resolution;

                    // Apply velocity from cell to particle
                    this.xv += (1 - ax) * cell_data.xv * config.particle_drag;
                    this.yv += (1 - ay) * cell_data.yv * config.particle_drag;

                    if (cell_data.right) {
                        this.xv += ax * cell_data.right.xv * config.particle_drag;
                        this.yv += ax * cell_data.right.yv * config.particle_drag;
                    }
                    if (cell_data.down) {
                        this.xv += ay * cell_data.down.xv * config.particle_drag;
                        this.yv += ay * cell_data.down.yv * config.particle_drag;
                    }

                    this.x += this.xv;
                    this.y += this.yv;

                    let dx = this.px - this.x;
                    let dy = this.py - this.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    let limit = Math.random() * 0.5;

                    if (dist > limit) {
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(this.px, this.py);
                        ctx.strokeStyle = this.color;
                        ctx.stroke();
                    }

                    this.px = this.x;
                    this.py = this.y;
                } else {
                    // Reset if out of bounds
                    this.x = this.px = Math.random() * width;
                    this.y = this.py = Math.random() * height;
                    this.xv = this.yv = 0;
                }

                this.xv *= 0.5;
                this.yv *= 0.5;
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < config.speck_count; i++) {
                particles.push(new Particle(Math.random() * width, Math.random() * height));
            }
        }

        function update_pressure(cell_data) {
            let pressure_x = (
                cell_data.up_left.xv * 0.5 + cell_data.left.xv +
                cell_data.down_left.xv * 0.5 - cell_data.up_right.xv * 0.5 -
                cell_data.right.xv - cell_data.down_right.xv * 0.5
            );
            let pressure_y = (
                cell_data.up_left.yv * 0.5 + cell_data.up.yv +
                cell_data.up_right.yv * 0.5 - cell_data.down_left.yv * 0.5 -
                cell_data.down.yv - cell_data.down_right.yv * 0.5
            );
            cell_data.pressure = (pressure_x + pressure_y) * 0.25;
        }

        function update_velocity(cell_data) {
            cell_data.xv += (
                cell_data.up_left.pressure * 0.5 + cell_data.left.pressure +
                cell_data.down_left.pressure * 0.5 - cell_data.up_right.pressure * 0.5 -
                cell_data.right.pressure - cell_data.down_right.pressure * 0.5
            ) * 0.25;
            cell_data.yv += (
                cell_data.up_left.pressure * 0.5 + cell_data.up.pressure +
                cell_data.up_right.pressure * 0.5 - cell_data.down_left.pressure * 0.5 -
                cell_data.down.pressure - cell_data.down_right.pressure * 0.5
            ) * 0.25;

            cell_data.xv *= config.viscosity;
            cell_data.yv *= config.viscosity;
        }

        function change_cell_velocity(cell_data, mvelX, mvelY, pen_size) {
            let dx = cell_data.x - mouse.x;
            let dy = cell_data.y - mouse.y;
            let dist = Math.sqrt(dy * dy + dx * dx);
            if (dist < pen_size) {
                if (dist < 4) dist = pen_size;
                let power = pen_size / dist;
                cell_data.xv += mvelX * power;
                cell_data.yv += mvelY * power;
            }
        }

        function animate() {
            // Mouse velocity
            let mouse_xv = mouse.x - mouse.px;
            let mouse_yv = mouse.y - mouse.py;

            // Update cells
            for (let i = 0; i < vec_cells.length; i++) {
                for (let j = 0; j < vec_cells[i].length; j++) {
                    let cell_data = vec_cells[i][j];
                    if (mouse.down || (Math.abs(mouse_xv) > 0 || Math.abs(mouse_yv) > 0)) {
                        change_cell_velocity(cell_data, mouse_xv, mouse_yv, config.pen_size);
                    }
                    update_pressure(cell_data);
                }
            }

            // Clear canvas with deep black/fade for trails, BUT user wants "glossy dark"
            // Let's use a very transparent black to leave trails
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(0, 0, width, height);

            // Draw particles
            for (let p of particles) p.update();

            // Cell Velocity Update
            for (let i = 0; i < vec_cells.length; i++) {
                for (let j = 0; j < vec_cells[i].length; j++) {
                    update_velocity(vec_cells[i][j]);
                }
            }

            mouse.px = mouse.x;
            mouse.py = mouse.y;

            animationFrameId = requestAnimationFrame(animate);
        }

        // Initialize
        resize();
        initParticles();
        animate();

        // Listeners
        window.addEventListener('resize', () => {
            resize();
            initParticles(); // Re-init particles on resize to avoid out of bounds
        });

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
        const handleMouseDown = () => mouse.down = true;
        const handleMouseUp = () => mouse.down = false;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Touch support
        const handleTouchMove = (e) => {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchstart', (e) => {
            handleTouchMove(e);
            mouse.down = true;
        });
        window.addEventListener('touchend', () => mouse.down = false);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 bg-black"
        />
    );
};

export default FluidBackground;
